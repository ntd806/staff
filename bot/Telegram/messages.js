var Helper =  require('../../helper/helper')
var {OPTIONS} =  require('../../const/const')
var {Message, Status} =  require('../../models')
const date = require('date-and-time')
const welcome = "Xin vui lòng nhắn tin với cú pháp"
const help = "Tôi có thể giúp gì cho bạn!"
const cannotback = "Bạn không thể về chỗ khi chưa gửi tin ra ngoài"
const CheckinEAT = "Checkin_Mã nhân viên_EAT"
const CheckoutEAT = "Checkout_Mã nhân viên_EAT"
const CheckinSMK = "Checkin_Mã nhân viên_SMK"
const CheckoutSMK = "Checkout_Mã nhân viên_SMK" 
const CheckinWC = "Checkin_Mã nhân viên_WC" 
const CheckoutWC = "Checkout_Mã nhân viên_WC"
const CheckoutDWC = "Checkin_Mã nhân viên_DWC"
const CheckinDWC = "Checkout_Mã nhân viên_DWC"
const OVERTIME = "vượt quá thời gian quy định"

function  keyBoard(){
	return {
		"reply_markup": {
		"keyboard": [["Đi (EAT)", 'Về chỗ (EAT)'], ["Đi (SMK)", 'Về chỗ (SMK)'], ["Đi (WC)", 'Về chỗ (WC)'], ["Đi (DWC)", 'Về chỗ (DWC)']]
		}
	}
}

function notice(data){
	const now = new Date()

	return 'Mã ID '+data.employeeId + ' ' +data.preAction+ ' ' + data.action + ' thành công\n'+ ' lúc '+date.format(now, 'YYYY/MM/DD HH:mm:ss GMT+08:00');
}

function answerAction(action){
	return welcome+" \n " + action;
}

function checkTime(action){
	let time = 0

	switch(action){
		case 'EAT':
			time = 30*1000*60
		    break
		case 'SMK':
			time = 10*1000*60
			break
	    case 'DWC':
			time = 15*1000*60
			break
		case 'WC':
			time = 3*1000*60
			break
		default:
		    break
	}

	return time;
}


module.exports = function Chat(bot) {
	bot.on('message', async (msg) => {
		let arr = Helper.checkSyntax(msg.text.toString(), '_')
        let time = checkTime(arr[2].toUpperCase());

        if(Helper.checkLength(arr, 1) == false && Helper.checkLength(arr, 3) == false) {
			bot.sendMessage(msg.chat.id, help, keyBoard())
		}

		if (Helper.checkLength(arr, 3)){
	        
			switch(arr[0].toUpperCase()){
				case OPTIONS.CHECK_IN:

					const checkin = {
						"employeeId": arr[1],
						"note": "no note",
						"preAction": arr[0].toUpperCase(),
						"action": arr[2].toUpperCase(),
						"status": OPTIONS.WAIT,
					}

					try {
						const MSG = await Message.create(checkin)
						bot.sendMessage(msg.chat.id, notice(checkin))
						const myTimeout = setTimeout(()=>{
							bot.sendMessage(msg.chat.id, 'Mã ID ' +checkin.employeeId + "\nĐi "+checkin.action +" " + OVERTIME)
							clearTimeout(myTimeout)
						}, time)

					} catch (err) {
						console.log(err)
					}
					break
				case OPTIONS.CHECK_OUT:

					const checkout = {
						"employeeId": arr[1],
						"note": "no note",
						"preAction": arr[0].toUpperCase(),
						"action": arr[2].toUpperCase(),
						"status": OPTIONS.DONE,
					}

					try {
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
							const yesterday = new Date(MSG.createdAt)
							const today = new Date(checkOut.createdAt)
							let consume = date.subtract(today, yesterday).toMinutes()
							const data = {
								"employeeId": checkout.employeeId,
								"action": checkout.action,
								"total": consume.toFixed(3)
							}
							const status = Status.create(data)

							bot.sendMessage(msg.chat.id, notice(checkout))
							//console.log(MSG)
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


		if (Helper.checkLength(arr, 1)) {
			let action = arr[0].toUpperCase()
			switch(action){
				case OPTIONS.CHECK_IN_MEAL:
					bot.sendMessage(msg.chat.id, answerAction(CheckinEAT))
					break
				case OPTIONS.CHECK_OUT_MEAL:
					bot.sendMessage(msg.chat.id, answerAction(CheckoutEAT))
					break
				case OPTIONS.CHECK_IN_SMOKING:
					bot.sendMessage(msg.chat.id, answerAction(CheckinSMK))
					break
				case OPTIONS.CHECK_OUT_SMOKING:
					bot.sendMessage(msg.chat.id, answerAction(CheckoutSMK))
					break
				case OPTIONS.CHECK_IN_RESTROOM:
					bot.sendMessage(msg.chat.id, answerAction(CheckinWC))
					break
				case OPTIONS.CHECK_OUT_RESTROOM:
					bot.sendMessage(msg.chat.id, answerAction(CheckoutWC))
					break
				case OPTIONS.CHECK_IN_DWC:
						bot.sendMessage(msg.chat.id, answerAction(CheckinDWC))
						break
				case OPTIONS.CHECK_OUT_DWC:
					bot.sendMessage(msg.chat.id, answerAction(CheckoutDWC))
					break
				default:
					bot.sendMessage(msg.chat.id, help, keyBoard())
					break
			}

		}

	})
}
