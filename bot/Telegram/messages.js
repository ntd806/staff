var Helper =  require('../../helper/helper');
var {Message, Dayoff} =  require('../../models');
const date = require('date-and-time');
const  CHECK_IN_MEAL = 'CHECK IN MEAL';
const  CHECK_OUT_MEAL = 'CHECK OUT MEAL';
const  CHECK_IN_SMOKING = 'CHECK IN SMOKING';
const  CHECK_OUT_SMOKING = 'CHECK OUT SMOKING';
const  CHECK_IN_RESTROOM = 'CHECK IN RESTROOM';
const  CHECK_OUT_RESTROOM = 'CHECK OUT RESTROOM';
const  DAY_OFF = 'DAY OFF';
const  CHECK_IN = 'CHECKIN';
const  CHECK_OUT = 'CHECKOUT';
const  DAY_OFF_WORK = 'DAYOFF';
const  MEAL = 'MEAL';

module.exports = function Chat(bot) {
	bot.on('message', async (msg) => {
		let arr = Helper.checkSyntax(msg.text.toString(), '_');
        const now = new Date()

        if(Helper.checkLength(arr, 1) == false && Helper.checkLength(arr, 3) == false && Helper.checkLength(arr, 7) == false) {
			bot.sendMessage(msg.chat.id, "How can I help you!", {
				"reply_markup": {
					"keyboard": [["Check in Meal", 'Check out Meal'], ["Check in Smoking", 'Check out Smoking'], ["Check in Restroom", 'Check out Restroom'], ['Day off']]
					}
			});
		}

		if (Helper.checkLength(arr, 3)){
			const message = {
				"employeeId": arr[1],
				"note": "no note",
				"preAction": arr[0].toUpperCase(),
				"action": arr[2].toUpperCase()
			}
	        
			switch(message.preAction){
				case CHECK_IN:
					try {
						const MSG = await Message.create(message)
						bot.sendMessage(msg.chat.id,'User '+message.employeeId + ' ' +message.preAction+ ' ' + message.action + ' succesfully\n'+ ' At '+date.format(now, 'YYYY/MM/DD HH:mm:ss GMT+08:00'));
						// console.log(MSG)
					} catch (err) {
						console.log(err)
					}
					break;
				case CHECK_OUT:
					try {
						const checkOut = await Message.create(message)
						const MSG = await Message.findOne({
							offset: 0, limit: 1,
							where: {"employeeId":message.employeeId, "preAction":"CHECKIN", 'action': message.action},
							order: [
								['createdAt', 'DESC'],
							],
						  })
						const yesterday = new Date(MSG.createdAt);
						const today = new Date(checkOut.createdAt);

						let consume = date.subtract(today, yesterday).toMinutes();
						bot.sendMessage(msg.chat.id,'User '+message.employeeId + ' ' +message.preAction+ ' ' + message.action + ' succesfully\n'+ 'Duration: ' + consume. toFixed(3) + '\n' + 'At: ' + date.format(now, 'YYYY-MM-DD HH:mm:ss GMT+08:00'))
						//console.log(MSG)
					} catch (err) {
						console.log(err)
					}
					break;
				default:
					bot.sendMessage(msg.chat.id, "How can I help you!", {
						"reply_markup": {
							"keyboard": [["Check in Meal", 'Check out Meal'], ["Check in Smoking", 'Check out Smoking'], ["Check in Restroom", 'Check out Restroom'], ['Day off']]
							}
					});
					break;
			}
		}

		if (Helper.checkLength(arr, 7)){
			
			const message = {
				"preAction": arr[0].toUpperCase(),
				"employeeId": arr[1],
				'start': arr[3],
				'end': arr[5],
				"note": arr[6].toUpperCase(),
			}

			switch (message.preAction) {
				case DAY_OFF_WORK:
					const dayoff = await Dayoff.create(message)
					bot.sendMessage(msg.chat.id,'User '+message.employeeId + ' ' +message.preAction+ ' succesfully\n' + '\n' + 'At: ' + date.format(now, 'YYYY-MM-DD HH:mm:ss GMT+08:00'))
				break;
				default:
					bot.sendMessage(msg.chat.id, "How can I help you!", {
						"reply_markup": {
							"keyboard": [["Check in Meal", 'Check out Meal'], ["Check in Smoking", 'Check out Smoking'], ["Check in Restroom", 'Check out Restroom'], ['Day off']]
							}
					});
				break;
			}
		}

		if (Helper.checkLength(arr, 1)) {
			let action = arr[0].toUpperCase();
			switch(action){
				case CHECK_IN_MEAL:
					bot.sendMessage(msg.chat.id,"Please Check in Meal with form \n Checkin_YourId_Meal");
					break
				case CHECK_OUT_MEAL:
					bot.sendMessage(msg.chat.id,"Please Check out Meal with form \n Checkout_YourId_Meal");
					break
				case CHECK_IN_SMOKING:
					bot.sendMessage(msg.chat.id,"Please Check in Smoking with form \n Checkin_YourId_Smoking");
					break
				case CHECK_OUT_SMOKING:
					bot.sendMessage(msg.chat.id,"Please Check out Smoking with form \n Checkout_YourId_Smoking");
					break
				case CHECK_IN_RESTROOM:
					bot.sendMessage(msg.chat.id,"Please Check in Restroom with form \n Checkin_YourId_Restroom");
					break
				case CHECK_OUT_RESTROOM:
					bot.sendMessage(msg.chat.id,"Please Check out Restroom with form \n Checkout_YourId_Restroom");
					break
				case DAY_OFF:
					bot.sendMessage(msg.chat.id,"If you want a day off please text \n Dayoff_YourId__From_YYYY-MM-DD_to_YYYY-MM-DD_note");
					break
				default:
					bot.sendMessage(msg.chat.id, "How can I help you!", {
						"reply_markup": {
							"keyboard": [["Check in Meal", 'Check out Meal'], ["Check in Smoking", 'Check out Smoking'], ["Check in Restroom", 'Check out Restroom'], ['Day off']]
							}
					});
					break;
			}

		}

	});
}
