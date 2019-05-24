// window.onhashchange = updateHash;

const app = new Vue({
    el: '#app',
    data: {
        ready: false,
        viewonly: false,
        gname: 'ABC JC Frisbee League 1',
        teams: ['', ''],
        fixture: [],
        scores: [],
        wins: [], loss: [], draws: [],
        gf: [], ga:[], gd: [],
        pts: [], wpt: 3, lpt:0, dpt:1,
        result: []
    },
    watch: {
        wpt: updateHash,
        lpt: updateHash,
        dpt: updateHash,
        teams: updateHash,
        gname: updateHash,
        scores() {
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

            const scores = [];
            const fixture = [];

            for (let i=0; i<leng; i++) {
                for (let j=i+1; j<leng; j++) {
                    fixture.push([i, j]);
                    scores.push(['', '']);
                }
            }

            this.scores = scores;
            this.fixture = fixture;

            this.result = [];
            for(let i=0; i<leng; i++) {
                this.result.push(i);
            }
        },
        updateInfo(obj) {
            alert('update');
            this.gname = obj.gname;
            this.teams = obj.teams;
            this.scores = obj.scores;
            this.fixture = obj.fixture;

            this.wpt = obj.wpt;
            this.dpt = obj.dpt;
            this.lpt = obj.lpt;
        }
    },
    created() {
        readHash();
        if (!this.fixture) {
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
        fixture: app.fixture,
        wpt: app.wpt, dpt: app.dpt, lpt: app.lpt,
    };
}

function readHash(){
    if (location.hash.indexOf('?') > -1) {
        const obj = JSON.parse(atob(location.hash.split('?')[1]));
        app.updateInfo(obj);
    }
}

function updateHash(){
    app.viewonly = location.hash.startsWith('#/view');

    if (app.ready) {
        const hash = btoa(JSON.stringify(getHashInfo()));

        if (location.hash.indexOf('?') === -1) {
            location.hash += `?${hash}`;
        } else {
            location.hash = `${location.hash.split('?')[0]}?${hash}`;
        }
    }

    console.log(location.hash);
}

function toggleViewOnly() {
    if (app.viewonly) {
        location.hash = '#' + location.hash.slice(6);
    } else {
        location.hash = '#/view' + location.hash.slice(1);
    }
}
