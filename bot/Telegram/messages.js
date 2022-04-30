var Helper =  require('../../helper/helper')
var {OPTIONS} =  require('../../const/const')
var {Message, Status, User, Department, Group, MemGroup, sequelize} =  require('../../models')
const date = require('date-and-time')
const help = "Tôi có thể giúp gì cho bạn?\n Nếu chưa đăng kí xin vui lòng nhắn tin cú pháp\n Mã nhân viên_Phòng ban_Leader group\n ví dụ\n 22222_Marketing_USA"
const cannotback = "Bạn không thể về chỗ khi chưa gửi tin ra ngoài"
const OVERTIME = "vượt quá thời gian quy định"
const confirmID = "Không tìm thấy mã nhân viên. Vui lòng kiểm tra lại\n Nếu chưa đăng kí xin vui lòng nhắn tin cú pháp\n Mã nhân viên_Phòng ban_Leader group\n ví dụ\n 22222_Marketing_US"
const TIME_EAT = 1810000 // 30 minutes
const TIME_SMK = 610000  // 10 minutes
const TIME_DWC = 910000 // 15 minutes
const TIME_WC = 310000 // 5 minutes
const timeEat = ((TIME_EAT/1000)/60)
const timeSMK = ((TIME_SMK/1000)/60)
const timeDWC = ((TIME_DWC/1000)/60)
const timeWC = ((TIME_WC/1000)/60)

function  keyBoard(){
	return {
		"reply_markup": {
		"keyboard": [["Đi EAT", 'Về-chỗ EAT'], ["Đi SMK", 'Về-chỗ SMK'], ["Đi WC", 'Về-chỗ WC'], ["Đi DWC", 'Về-chỗ DWC']]
		}
	}
}

function notice(data, name = ''){
	const now = new Date()
	return name + ' ' +data.preAction+ ' ' + data.action + ' thành công\n'+ ' lúc '+date.format(now, 'YYYY/MM/DD HH:mm:ss GMT+08:00')
}

function checkTime(action){
	let time = 0

	switch(action){
		case 'EAT':
			time = TIME_EAT
		    break
		case 'SMK':
			time = TIME_SMK
			break
	    case 'DWC':
			time = TIME_DWC
			break
		case 'WC':
			time = TIME_WC
			break
		default:
		    break
	}

	return time;
}

async function getUserName(email){
	const user = await User.findOne({
		where: {email},
	})

	return user
}

async function getStatus(day='', depName = ''){
    
	let time = convertTime(day)
	depName = depName.toUpperCase()
	let select = "SELECT de.name, u.email, s.action, SUM(s.total) as Total , COUNT(s.id) as times"
	let from = "FROM statuses s"
	let join = "right JOIN users u on u.employeeId = s.employeeId right JOIN departments de ON de.id = u.depId"
	let where = "where s.createdAt like '%"+time+"%' and de.name = '"+depName+"'"
	let groupBy = "GROUP BY s.action , u.email ORDER BY u.email ASC"
	let sql = select +from + join + where + groupBy
    
	return getStatistics(sql)
}

async function getStatistics(sql = ''){
	try {
		let status = await sequelize.query(sql, {
			model: Status,
			mapToModel: true // pass true here if you have any mapped fields
		})

		return status

    } catch (error) {
        console.log(error)
    }
}

async function getOverTime(depName, end, action, total){
	let e = convertTime(end)

	depName = depName.toUpperCase()
	let select = `SELECT de.name, u.email, s.action, s.total - ${total} as overtime`
	let from = ` FROM statuses s`
	let join = ` right JOIN users u on u.employeeId = s.employeeId right JOIN departments de ON de.id = u.depId`
	let where = ` where s.createdAt like '%${e}%' and de.name = '${depName}' and s.action = '${action}' and s.total > ${total}`
	let groupBy = ` ORDER BY u.email ASC`
	let sql = select +from + join + where + groupBy

	return getStatistics(sql)
}

function convertTime(day){
	const now = new Date()
	if (day === 'today') {
		day = date.format(now, 'YYYY-MM-DD')

		return day
	}

	let check = day.split('-')
	if(check.length == 3){
		return day
	}
}

function converString(status){
	let s = ''
	if(status){
	    let len = status.length
		for (var i = 0; i < len; i++) {
			let st = status[i].dataValues.email + ' Tổng thời gian: ' + status[i].dataValues.Total.toFixed(3) + " Đã đi " + status[i].dataValues.action + " Số lần: " +status[i].dataValues.times +"\n"
			s = s + st
			st = ''
		}
    }
	return s
}

function stringOvertime(status){
	let s = ''

	if(status){
		let len = status.length
		for (var i = 0; i < len; i++) {
			let overtime = status[i].dataValues.overtime.toFixed(3)
			if (overtime > 0) {
				let st = status[i].dataValues.email + ' Tổng thời gian vượt quá: ' + overtime + " Đã đi " + status[i].dataValues.action +"\n"
				s = s + st
				st = ''
			}
		}
	}

	return s
}

module.exports = function Chat(bot) {
	bot.on('message', async (msg) => {
		let arr = Helper.checkSyntax(msg.text, '_')

        if(Helper.checkLength(arr, 3) == false && Helper.checkLength(arr, 1) == false && Helper.checkLength(arr, 2) == false && Helper.checkLength(arr, 4) == false) {
			bot.sendMessage(msg.chat.id, help, keyBoard())
		}

		if(Helper.checkLength(arr, 4)){
			let EATS = await getOverTime(arr[0], arr[3], 'EAT', timeEat)
			let SMKS = await getOverTime(arr[0], arr[3], 'SMK', timeSMK)
			let DWCS = await getOverTime(arr[0], arr[3], 'DWC', timeDWC)
			let WCS = await getOverTime(arr[0], arr[3], 'WC', timeWC)

			let data = stringOvertime(EATS) + stringOvertime(SMKS) + stringOvertime(DWCS) + stringOvertime(WCS)
			if (!data) {
				data = "Không có dữ liệu hoặc không tìm thấy phòng ban nào vui lòng kiểm tra lại"
			}

			bot.sendMessage(msg.chat.id, data)
		}

		if(Helper.checkLength(arr, 2)){
			let status = await getStatus(arr[1], arr[0])
			let data = converString(status)
			if (!data) {
				data = "Không có dữ liệu hoặc không tìm thấy phòng ban nào vui lòng kiểm tra lại"
			}
			
			bot.sendMessage(msg.chat.id, data)
		}
        
		if(Helper.checkLength(arr, 3)){
			let password = "$2b$10$GabHM4suChxH0s3/NrhPxen3Uw05BsITBrV2qLUGg7t/IKEkPupLK"
			let salary = 1000
			let department = await Department.findOne({
				where: { name: arr[1].toUpperCase() },
			})
            
			if(!department){
				bot.sendMessage(msg.chat.id, "Không tìm thầy phòng ban. Vui lòng tham khảo\n SEO\n MARKETING\n TELESALE\n BACKSTAGE\n")
			}

            if( (msg.from.username) && (department) ){
                let depId = department.dataValues.id
				const data = {
					"employeeId": parseInt(arr[0]),
					password,
					"role": "EMPLOYEE",
					depId,
					salary,
					"email": msg.from.username
				}
	
				const [user] = await User.findOrCreate({
					where:  data,
				})
	
				const [group] = await Group.findOrCreate({
					where: { name: arr[2].toUpperCase() },
				})
				
				const [memGroup] = await MemGroup.findOrCreate({
					where: { "employeeId": user.dataValues.employeeId, "groupId": group.dataValues.id},
				})
	
				bot.sendMessage(msg.chat.id, msg.from.first_name+' '+ msg.from.last_name + " đã đăng kí thành công với mã nhân viên " + user.dataValues.employeeId)
			}else{
				bot.sendMessage(msg.chat.id, "Đăng kí không thành công!\n Vui lòng kiểm tra lại đã tạo Username ở telegram hoặc đúng tên phòng ban chưa?")
			}
		}

		if (Helper.checkLength(arr, 1)){
			const actions = msg.text.split(' ')
			let user = null
			if(msg.from.username) {
				let email = msg.from.username
				user = await getUserName(email)
			}
			const action = actions[0].toUpperCase()
			let time = 0;
			if(actions[1]) {
				time = checkTime(actions[1].toUpperCase());
			}
			
			switch(action){
				case OPTIONS.CHECK_IN:
					try {
						if(!user) { bot.sendMessage(msg.chat.id, confirmID) }else{
							const checkin = {
								"employeeId": user.dataValues.employeeId,
								"note": "no note",
								"preAction": "CHECKIN",
								"action": actions[1].toUpperCase(),
								"status": OPTIONS.WAIT,
							}
							const MSG = await Message.create(checkin)
							bot.sendMessage(msg.chat.id, notice(checkin, msg.from.first_name+' '+ msg.from.last_name ))
							const myTimeout = setTimeout( async()=>{
								const MSG = await Message.findOne({
									offset: 0, limit: 1,
									where: {"employeeId":checkin.employeeId, "preAction":"CHECKIN", 'action': checkin.action, "status": OPTIONS.WAIT},
									order: [
										['createdAt', 'DESC'],
									],
									})

								if(MSG) {
									bot.sendMessage(msg.chat.id,  msg.from.first_name+' '+ msg.from.last_name + "\nĐi "+checkin.action +" " + OVERTIME)
									clearTimeout(myTimeout)
								}

							}, time)
						}
						
					} catch (err) {
						console.log(err)
					}

					break
				case OPTIONS.CHECK_OUT:
					try {
						if(!user) { bot.sendMessage(msg.chat.id, confirmID) }else{
							const checkout = {
								"employeeId": user.dataValues.employeeId,
								"note": "no note",
								"preAction": "CHECKOUT",
								"action": actions[1].toUpperCase(),
								"status": OPTIONS.DONE,
							}
							const checkOut = await Message.create(checkout)
							const MSG = await Message.findOne({
								offset: 0, limit: 1,
								where: {"employeeId":checkout.employeeId, "preAction":"CHECKIN", 'action': checkout.action, "status": OPTIONS.WAIT},
								order: [
									['createdAt', 'DESC'],
								],
								})

							if (!MSG) {
								bot.sendMessage(msg.chat.id, cannotback)
							}else{
								MSG.update({status:OPTIONS.DONE})
								const yesterday = new Date(MSG.createdAt)
								const today = new Date(checkOut.createdAt)
								let consume = date.subtract(today, yesterday).toMinutes()
								const data = {
									"employeeId": checkout.employeeId,
									"action": checkout.action,
									"total": consume.toFixed(3)
								}
								const status = Status.create(data)
								bot.sendMessage(msg.chat.id, notice(checkout, msg.from.first_name+' '+ msg.from.last_name)+"\n Thời gian: "+consume.toFixed(3))
							}
					    }
					} catch (err) {
						console.log(err)
					}
					break
				default:
					bot.sendMessage(msg.chat.id, help, keyBoard())
					break
			}
		}
	})
}
