const express = require('express')
const router = express.Router()

const receipts = {}

function generateId() {
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'

	const getRandomString = (length) => {
		let result = '';
		for (let i = 0; i < length; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length))
		}
		return result
	}

	const part1 = getRandomString(8)
	const part2 = getRandomString(4)
	const part3 = getRandomString(4)
	const part4 = getRandomString(4)
	const part5 = getRandomString(12)

	return `${part1}-${part2}-${part3}-${part4}-${part5}`
}

const calculatePoints = (receipt) => {
	let totalPoints = 0

	const alphaNumericCount = (receipt.retailer.match(/[a-zA-Z0-9]/g) || []).length

	const roundDollarAmount = receipt.total.slice(-2) == "00"

	const multipleOf25 = Number(receipt.total.slice(-2)) % 25 === 0

	const numberOfPairs = Math.floor(receipt.items.length / 2)

	const multiplesOf3 = (items) => {
		let points = 0
		items.forEach(item => {
			const descriptionLength = item.shortDescription.trim().length

			if (descriptionLength % 3 === 0) {
				points += Math.ceil(parseFloat(item.price) * 0.2)
			}
		})
		return points
	}
	const pointsForMultiplesOf3 = multiplesOf3(receipt.items)

	const LLM = false // :)

	const oddPurchaseDate = Number(receipt.purchaseDate.slice(-2)) % 2 !== 0

	const purchaseTime = parseInt(receipt.purchaseTime.replace(":", ""))
	const timeBetween2and4 = purchaseTime >= 1400 && purchaseTime < 1600

	totalPoints += alphaNumericCount
	totalPoints += roundDollarAmount ? 50 : 0
	totalPoints += multipleOf25 ? 25 : 0
	totalPoints += numberOfPairs * 5
	totalPoints += pointsForMultiplesOf3
	totalPoints += oddPurchaseDate ? 6 : 0
	totalPoints += timeBetween2and4 ? 10 : 0

	return totalPoints

}

const validateReceipt = (req, res, next) => {
	const { retailer, purchaseDate, purchaseTime, items, total } = req.body

	if (!retailer || !purchaseDate || !purchaseTime || !items || !total) {
		return res.status(400).json({ message: "The receipt is invalid." })
	}

	next()
}


const processReceipt = async (req, res) => {
	const receipt = req.body

	const id = generateId()

	receipts[id] = calculatePoints(receipt)

	res.status(200).json({ id })
}

const retrievePoints = async (req, res) => {
	const { id } = req.params

	if (receipts[id] !== undefined) {
		return res.status(200).json({ points: receipts[id] })
	}

	res.status(404).json({ message: "No receipt found for that ID." })
}

router.post('/process', validateReceipt, processReceipt)
router.get('/:id/points', retrievePoints)


module.exports = router