if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('worker.js');
}

window.onhashchange = updateHash;

function valid(last, next) {
    for (let i=0; i<2; i++) {
        if (last[i] == next[0] || last[i] == next[1]) {
            return false;
        } 
    }

    return true;
}

function rmIdx(array, idx) {
    return array.slice(0,idx).concat(array.slice(idx+1));
}

function dp(curr, left) {
    const leng = left.length;
    if (curr.length===0) {
        return dp([left[0]], rmIdx(left, 0));
    }
    
    if (left.length===0) {
        return curr;
    }

    for (let i=0; i<leng; i++) {
        if (valid(curr[curr.length-1], left[i])) {
            const ans = dp(
                curr.slice().concat([left[i]]),
                rmIdx(left, i));
            if (ans) { return ans; }
        }
    }

    return null;
}

const app = new Vue({
    el: '#app',
    data: {
        ready: false,
        viewonly: false,
        gname: 'ABC JC Frisbee League 1',
        teams: ['', ''],
        isFixture: false,
        fixture: [],
        scores: [], played: [],
        wins: [], loss: [], draws: [],
        gf: [], ga:[], gd: [],
        pts: [], wpt: 3, lpt:0, dpt:1,
        result: []
    },
    watch: {
        teams: updateHash,
        gname: updateHash,
        wpt() { this.recalc(); updateHash; },
        lpt() { this.recalc(); updateHash; },
        dpt() { this.recalc(); updateHash; },
        scores() { this.recalc(); updateHash;  },
    },
    methods: {
        getName(idx) {
            return this.teams[idx] || `team ${idx}`;
        },
        addTeam() {
            this.teams.push('');
            this.genFixture();
            updateHash();
        },
        genFixture() {
            const leng = this.teams.length;
            const all = [];

            for (let i=0; i<leng; i++) {
                for (let j=i+1; j<leng; j++) {
                    all.push([i, j]); 
                    this.scores.push(['', '']);
                }
            }

            this.isFixture = true;
            this.fixture = dp([], all);
            if (!this.fixture) {
                this.fixture = all;
                this.isFixture = false;
            }

            this.result = [];
            for(let i=0; i<leng; i++) {
                this.result.push(i);
                this.played.push(0);
            }

            this.recalc();
        },
        updateInfo(obj) {
            Object.keys(obj).forEach(key => {
                this[key] = obj[key];
            });
        },
        recalc() {
            const leng = this.teams.length;

            function init() {
                const arr = [];
                for(let i=0; i<leng; i++) {
                    arr.push(0);
                }
                return arr;
            }

            const wins = init();
            const loss = init();
            const draws = init();

            const gf = init();
            const ga = init();

            this.fixture.forEach((game, gid) => {
                const [teamA, teamB] = game;
                const [rscoreA, rscoreB] = this.scores[gid];

                if (rscoreA === '' || rscoreB === '') { return; }

                const scoreA = parseInt(rscoreA);
                const scoreB = parseInt(rscoreB);

                if (scoreA == scoreB) {
                    draws[teamA] += 1; draws[teamB] += 1;
                } else if (parseInt(scoreA) > parseInt(scoreB)) {
                    wins[teamA] += 1; loss[teamB] += 1;
                } else {
                    loss[teamA] += 1; wins[teamB] += 1;
                }

                gf[teamA] += scoreA; ga[teamB] += scoreA;
                gf[teamB] += scoreB; ga[teamA] += scoreB;
            });

            const gd = init();
            const pts = init();
            for(let i=0; i<leng; i++) {
                gd[i] = gf[i]-ga[i];
                pts[i] = wins[i]*this.wpt + loss[i]*this.lpt + draws[i]*this.dpt;
            }

            this.pts = pts;
            this.wins = wins;
            this.loss = loss;
            this.draws = draws;

            this.gf = gf; this.ga = ga; this.gd = gd;

            this.result.sort((a, b) => {
                let val = pts[b]-pts[a];
                if (!val) { val = gd[b]-gd[a]; }
                if (!val) { val = gf[b]-gf[a]; }
                if (!val) { val = ga[a]-ga[b]; }
                return val;
            });

            updateHash();
        }
    },
    created() {
        this.updateInfo(readHash());
        if (this.fixture.length === 0) {
            this.genFixture();
        }

        this.ready = true;
    }
});

function getHashInfo(){
    return {
        gname: app.gname,
        teams: app.teams,
        scores: app.scores,
        result: app.result,
        fixture: app.fixture,
        isFixture: app.isFixture,
        wpt: app.wpt, dpt: app.dpt, lpt: app.lpt,
    };
}

function saveOffline(){
    localStorage.setItem('data', btoa(JSON.stringify(getHashInfo())));
}

function clearOffline(){
    localStorage.setItem('data', '');

    const url = location.href;
    if (url.indexOf('#')>-1) {
        location.href = url.split('#')[0];
    }
}

function readHash(){
    const data = (location.hash.indexOf('?') > -1)
        ? location.hash.split('?')[1]
        : localStorage.getItem('data');
    return data ? JSON.parse(atob(data)) : {};
}

function updateHash(){
    if (app) {
        app.viewonly = location.hash.startsWith('#/view');
        const hash = btoa(JSON.stringify(getHashInfo()));

        if (location.hash.indexOf('?') === -1) {
            location.hash += `?${hash}`;
        } else {
            location.hash = `${location.hash.split('?')[0]}?${hash}`;
        }
    }
}

function toggleViewOnly() {
    if (app.viewonly) {
        location.hash = '#' + location.hash.slice(6);
    } else {
        location.hash = '#/view' + location.hash.slice(1);
    }
}
