import { BESTIARY, BESTIARY_BRACKETS } from './bestiary'
import './style.css'

const playerName = prompt('Enter username')

const response = await fetch(`https://sky.shiiyu.moe/api/v2/profile/${playerName}`)
const data = await response.json()
//@ts-ignore
const bestiaryData = Object.values(data.profiles).find((p) => p.current === true).raw.bestiary.kills

interface MobEntry {
	category: string
	name: string
	kills: number
	nextMilestone: number
	toNextMilestone: number
}

const MobEntries = []

for (const category in BESTIARY) {
	if (category === 'fishing') continue

	for (const { mobs, bracket, cap, name } of BESTIARY[category].mobs) {
		let kills = 0
		for (const mobId of mobs) kills += bestiaryData[mobId] ?? 0

		let nextMilestone = 0
		for (const milestone of BESTIARY_BRACKETS[bracket]) {
			if (milestone <= kills) continue
			nextMilestone = milestone
			break
		}

		let toNextMilestone = nextMilestone - kills
		if (kills >= cap) toNextMilestone = -1

		const mobEntry: MobEntry = {
			//@ts-ignore
			category: BESTIARY[category].name,
			name,
			kills,
			nextMilestone,
			toNextMilestone,
		}
		MobEntries.push(mobEntry)
	}
}

const sortedEntreis = MobEntries.filter((e) => e.toNextMilestone >= 0).sort(
	(a, b) => a.toNextMilestone - b.toNextMilestone
)

for (const { name, category, toNextMilestone } of sortedEntreis)
	document.write(`${name} @ ${category} in ${toNextMilestone} kills </br>`)
