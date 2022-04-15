var Helper =  require('../../helper/helper')
var {OPTIONS} =  require('../../const/const')
var {Message, Status, User, Department, Group, MemGroup, sequelize} =  require('../../models')
const date = require('date-and-time')
const help = "Tôi có thể giúp gì cho bạn?\n Nếu chưa đăng kí xin vui lòng nhắn tin cú pháp\n Mã nhân viên_Phòng ban_Leader group\n ví dụ\n 22222_Marketing_USA"
const cannotback = "Bạn không thể về chỗ khi chưa gửi tin ra ngoài"
const OVERTIME = "vượt quá thời gian quy định"
const confirmID = "Không tìm thấy mã nhân viên. Vui lòng kiểm tra lại\n Nếu chưa đăng kí xin vui lòng nhắn tin cú pháp\n Mã nhân viên_Phòng ban_Leader group\n ví dụ\n 22222_Marketing_US"

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
			time = 1805000
		    break
		case 'SMK':
			time = 605000
			break
	    case 'DWC':
			time = 905000
			break
		case 'WC':
			time = 305000
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
    const now = new Date();
	let time = null;
	depName = depName.toUpperCase()
	
    switch (day) {
        case 'today':
            time = date.format(now, 'YYYY-MM-DD')
            break;
        case 'yesterday':
            time = date.addDays(now, -1)
			time = date.format(time, 'YYYY-MM-DD')
            break;
        default:
			let check = day.split('-')
			if(check.length == 3){
				time = day
			}
            break
    }

    try {
		let result = []
		let sql = "SELECT employeeId, action, SUM(total) as Total , COUNT(id) as times FROM statuses where createdAt like '%"+time+"%' GROUP BY action , employeeId;"
		let status = await sequelize.query(sql, {
			model: Status,
			mapToModel: true // pass true here if you have any mapped fields
		})
		let department = await Department.findOne({
			where: {name:depName},
		})

		if(department){
			let users = await User.findAll({
				where: {depId:department.id},
			})
			for(var i = 0; i < users.length; i++) {
				for(var j = 0; j < status.length; j++){
					if(users[i].dataValues.employeeId == status[j].dataValues.employeeId){
						result.push([users[i], status[j]])
					}
				}
			}
		}
        return result

    } catch (error) {
        console.log(error)
    }
}

function converString(status){
	let s = ''
	let len = status.length
	for (var i = 0; i < len; i++) {
		let st = status[i][0].email + ' Tổng thời gian: ' + status[i][1].dataValues.Total.toFixed(3) + " Đã đi " + status[i][1].dataValues.action + " Số lần: " +status[i][1].dataValues.times +"\n"
		s = s + st
		st = ''
	}
	console.log(s)

	return s
}

module.exports = function Chat(bot) {
	bot.on('message', async (msg) => {
		let arr = Helper.checkSyntax(msg.text, '_')

        if(Helper.checkLength(arr, 3) == false && Helper.checkLength(arr, 1) == false && Helper.checkLength(arr, 2) == false) {
			bot.sendMessage(msg.chat.id, help, keyBoard())
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
									MSG.update({status:OPTIONS.DONE})
									const data = {
										"employeeId": checkin.employeeId,
										"action": checkin.action,
										"total": ((time/1000)/60)
									}
									const status = Status.create(data)
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
