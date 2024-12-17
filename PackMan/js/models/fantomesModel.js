// Charger l'image du fantôme
export const imgFantomeRouge = new Image();
imgFantomeRouge.src = '../../img/rouge.png';

export const imgFantomeRose  = new Image();
imgFantomeRose .src = '../../img/rose.png';

export const imgFantomeBleu  = new Image();
imgFantomeBleu .src = '../../img/bleu.png';

export const imgFantomeOrange  = new Image();
imgFantomeOrange .src = '../../img/orange.png';

export const imgFantomeCerise  = new Image();
imgFantomeCerise .src = '../../img/cerise.png';

export const imgFantomePeur  = new Image();
imgFantomePeur .src = '../../img/peur.png';



 export let possitionFantomeRouge = { row: 4, col: 33 };

 export let possitionFantomeRose = { row: 7, col: 33 };

 export let possitionFantomeBleu= { row: 7, col: 32 };

 export let possitionFantomeOrange= { row: 8, col: 31 };

 export let possitionFantomeCerise= { row: 11, col: 33 };

 export function resetGhostsPositions() {
    possitionFantomeRouge.row = 4;
    possitionFantomeRouge.col = 33;
    possitionFantomeRose.row = 7;
    possitionFantomeRose.col = 33;
    possitionFantomeBleu.row = 7;
    possitionFantomeBleu.col = 32;
    possitionFantomeOrange.row = 8;
    possitionFantomeOrange.col = 31;

    console.log("Positions réinitialisées :", { possitionFantomeRouge });
}

export function getGhostsPositions() {
    return {
        rouge: possitionFantomeRouge,
        rose: possitionFantomeRose,
        bleu: possitionFantomeBleu,
        orange: possitionFantomeOrange,
        cerise: possitionFantomeCerise,
    };
}