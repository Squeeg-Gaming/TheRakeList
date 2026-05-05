import { fetchWhichLeaderboard, fetchList, fetchScratchIds } from '../content.js';
import { localize, mamaMia, getLevelThumbnail, getEngineSelect } from '../util.js';

import Spinner from '../components/Spinner.js';

export default {
    components: {
        Spinner,
    },
    data: () => ({
        leaderboard: [],
        loading: true,
        selected: 0,
        engineAsked: getEngineSelect(),
        err: [],
    }),
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-leaderboard-container">
            <div class="page-leaderboard">
                <div class="error-container">
                    <p class="error" v-if="err.length > 0">
                        Leaderboard may be incorrect, as the following levels could not be loaded: {{ err.join(', ') }}
                    </p>
                </div>
                <div class="board-container">
                    <table class="board">
                        <tr v-for="(ientry, i) in leaderboard">
                            <td class="rank">
                                <p class="type-label-lg">#{{ i + 1 }}</p>
                            </td> 
                            <td class="total" style="display: inline-flex; align-items: center; padding: 2rem;">
                                <p class="type-label-lg">{{ localize(ientry.total) }}</p> 
                            </td>
                            <td class="user" :class="{ 'active': selected == i }">
                                <button @click="selected = i">
                                    <div style="align-items: center; gap: 20px;">
                                        <span style="display: inline-block;" class="type-label-lg">{{ ientry.user }}</span>
                                    </div>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="player-container" style="border-collapse: separate;">
                    <div class="player" style="border-collapse: separate;">
                        <h1 style="display: inline-flex; align-items: center;">#{{ selected + 1 }} - {{ entry.user }}</h1> 
                        <template v-if="entry.verified.length > 0 || entry.completed.length > 0 || entry">
                        <h3>{{ entry.total }} - Hardest: {{ [...entry.verified, ...entry.completed].reduce((min, current) =>current.rank < min.rank ? current : min).level }}</h3>
                        </template>
                         <template v-if="entry.created.length > 0">
                        <h2>Created ({{ entry.created.length}})</h2>
                        <table class="table" style="display: grid; gap: 6px;">
                            <tr v-for="score in entry.created">
                                <td class="rank" style="text-align: end;">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level" style="border-radius: 10px; margin: 1px; padding-left: 18px; height: 48px;" :style="getLevelThumbnail(score.rank - 1, list)">
                                    <a class="type-label-lg" style="border-collapse: collapse; border-spacing: 0rem;" target="_blank" :href="score.link">{{ score.level }}</a>
                                </td>
                            </tr>
                        </table>
                        </template>
                        <template v-if="entry.verified.length > 0">
                            <h2>Verified ({{ entry.verified.length}})</h2>
                            <table class="table" style="display: grid; gap: 6px;">
                                <tr v-for="score in entry.verified">
                                    <td class="rank" style="text-align: end;">
                                        <p>#{{ score.rank }}</p>
                                    </td>
                                    <td class="level" style="border-radius: 10px; margin: 1px; padding-left: 18px; height: 48px;" :style="getLevelThumbnail(score.rank - 1, list)">
                                        <a class="type-label-lg" style="border-collapse: collapse; border-spacing: 0rem;" target="_blank" :href="score.link">{{ score.level }}</a>
                                        <span class="type-label-sm">+{{ localize(score.score) }}</span>
                                    </td>
                                </tr>
                            </table>
                        </template>
                        <template v-if="entry.completed.length > 0">
                            <h2 v-if="entry.completed.length > 0">Completed ({{ entry.completed.length }})</h2>
                            <table class="table" style="display: grid; gap: 6px;">
                                <tr v-for="score in entry.completed">
                                    <td class="rank">
                                        <p>#{{ score.rank }}</p>
                                    </td>
                                    <td class="level" style="border-radius: 10px; margin: 1px; padding-left: 18px; height: 48px;" :style="getLevelThumbnail(score.rank - 1, list)">
                                        <a class="type-label-lg" style="border-collapse: collapse; border-spacing: 0rem" target="_blank" :href="score.link">{{ score.level }}</a>
                                        <span class="type-label-sm">+{{ localize(score.score) }}</span>
                                    </td>
                                </tr>
                            </table>
                        </template>
                        <template v-if="entry.progressed.length > 0">
                        <h2>Progressed ({{entry.progressed.length}})</h2>
                            <table class="table" style="display: grid; gap: 6px;">
                                <tr v-for="score in entry.progressed">
                                    <td class="rank">
                                        <p>#{{ score.rank }}</p>
                                    </td>
                                    <td class="level" style="border-radius: 10px; margin: 1px; padding-left: 18px; height: 48px;" :style="getLevelThumbnail(score.rank - 1, list)">
                                        <a class="type-label-lg" target="_blank" style="border-collapse: collapse; border-spacing: 0rem;" :href="score.link">{{ score.percent }}% - {{ score.level }}</a>
                                        <span class="type-label-sm">+{{ localize(score.score) }}</span>
                                    </td>
                                </tr>
                            </table>
                        </template>
                    </div>
                </div>
            </div>
        </main>
    `,
    computed: {
        entry() {
			console.error(this.leaderboard);
            return this.leaderboard[this.selected];
        },
    },
    async mounted() {
        let params = new URLSearchParams(document.location.search); 
        if (!params.get("type")) {
            this.whichLeaderboard = "Player";
        } else {
            this.whichLeaderboard = params.get("type").toLowerCase();
        }
        const [leaderboard, err] = await fetchWhichLeaderboard();
        this.list = await fetchList();
        this.leaderboard = leaderboard;
        let players = [];
        let pfps = [];
        for (let index = 0; index < leaderboard.length; index++) {
            players.push(this.leaderboard[index].user);
        }
        this.pfps = pfps;
        this.err = err;
        // Hide loading spinner
        this.loading = false;
    },
    methods: {
        localize,
        getLevelThumbnail,
    },
};
