let app = new PIXI.Application({
    width: 800,
    height: 1100,
    antialias: true,
    backgroundColor: 0xced6e2
  });
// Add main canvas block PIXI JS
document.body.appendChild(app.view);

class Elevator  {
    floor: number;
    peoples: Array<Object>;
    derection: string;
    elevatorTex: any;
    constructor(floor: number, peoples: Array<People>, derection: string){
        this.floor = floor;
        this.peoples = peoples;
        this.derection = derection;
        this.elevatorTex = this.createElevator() 
    };
    // Create Conteiner Block (PIXI JS) FOR ELEVATOR
    createElevator(){
        const elevatorTex = new PIXI.Container();
        const elevatoImg = PIXI.Sprite.from('img/elevator.png');
        elevatoImg.width = 130;
        elevatoImg.height = 130
        elevatorTex.addChild(elevatoImg);
        elevatoImg.x = 50;
        elevatoImg.y = 0;
        app.stage.addChild(elevatorTex);
        return elevatorTex;
    }
}
class Floor {
    peoples: Array<object>;
    floorNumber: number;
    floorTex: any;
    constructor(peoples: Array<Object>, floorNumber: number){
        this.peoples = peoples;
        this.floorNumber = floorNumber;
        this.floorTex = this.createFloor();
    };
    // Create Conteiner Block (PIXI JS) FOR FLOOR
    createFloor(){
        //block text to floor number
        const levelFloorText = new PIXI.Text('Level ' + (this.floorNumber) + '');
        const floorTex = new PIXI.Container();

        let height = this.floorNumber * 100 + 10;
        levelFloorText.x = 600;
        levelFloorText.y = height;
        floorTex.addChild(levelFloorText);

        app.stage.addChild(floorTex);
        // draw the floor
        let graphics = new PIXI.Graphics();
        graphics.lineStyle(2, 0xff00ff, 1);
        graphics.beginFill(0xff00bb, 0.25);
        graphics.drawRoundedRect(200, height, 500, 100, 1);
        graphics.endFill();
        floorTex.addChild(graphics);
        return floorTex;
    }
}
class People {
    floorDirection: string
    floorLeav: number
    floor: number
    peopleTex: any
    constructor(floorDirection: any,  conteiner: any, floor: number, floorLeav?: number, ){
        this.floorDirection = floorDirection ? "UP": "DOWN";
        this.floorLeav = floorDirection ? randomNumber(floor+1, numberFloor-1) : randomNumber(0, floor-1);
        this.floor = floor;
        this.peopleTex = this.createPeople(conteiner)
    };
    // Create Conteiner Block (PIXI JS) FOR PEOPLE
    createPeople(conteiner: any){
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 13,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff', '#00ff99'], // gradient
            stroke: '#4a1850',
            strokeThickness: 5,
            wordWrap: true,
            wordWrapWidth: 440,
        });
        // BLock with text on the top of people sprite
        const textpeople = new PIXI.Text((this.floorLeav) + '' + (this.floorDirection), style);
        const peopleTex = PIXI.Sprite.from('img/Ghera.png');

        let mainPeopleTex = new PIXI.Container();
        textpeople.x = 0;
        textpeople.y = -20;
        mainPeopleTex.addChild(textpeople);
        peopleTex.width = 50;
        peopleTex.height = 50
        mainPeopleTex.x = 600;
        mainPeopleTex.y = 100 * this.floor;
        mainPeopleTex.addChild(peopleTex);
        // add people blokc to the conteiner of floor
        conteiner.addChild(mainPeopleTex);
        return mainPeopleTex;
    }
}

let numberFloor: number = 7;
let timeForElevar: number = 1000;
let floors: Array<Floor> = []; // MAIN ARRAY OF FLOOR
let peopleCountInElevator: number = 4
let positionY = 0; // Need for set start elevator position

function init(): void {
    //get value from input if dount exist value get default
    peopleCountInElevator = document.getElementById("elevatorCount").value ? document.getElementById("elevatorCount").value : peopleCountInElevator;
    numberFloor = document.getElementById("floorCount").value ? document.getElementById("floorCount").value : numberFloor;

    for(let i = 0; i < numberFloor; i++){
        let floor = new Floor([], i)
        
        floors.push(floor)
        // Push peopele to the floor array
        startPushOnFloor(i, floor.floorTex);
    }
    moveElevator(timeForElevar);
}

function moveElevator(moveTime: number): void{
    let elevator = new Elevator(0, [], "UP");
    startElevatorMove(moveTime);

    function startElevatorMove(moveTime: number){
        if(!floors[elevator.floor].peoples.length){
            moveTime = 1000;
        }else{
            moveTime = 1800;
        }
        setTimeout(function(){
            // Check direction 
            if(elevator.floor == numberFloor-1){
                elevator.derection = "DOWN"
            }
            if(elevator.floor == 0){
                elevator.derection = "UP"
            }
            // Main function the check what peopele push to elevator or go out 
            statePosition(elevator)
    
            if(elevator.derection == "UP"){
                // animate elevator
                renderElevator(elevator, positionY, true);
                positionY = positionY + 100
                elevator.floor++
            }else{
                // animate elevator
                renderElevator(elevator, positionY, false);
                positionY = positionY - 100
                elevator.floor--
            }
            startElevatorMove(moveTime)
    
        }, moveTime);
    }
    
}
function statePosition(elevator: Elevator): void{
    // check what peoeple must leave elevator
    for(let i = 0; i < elevator.peoples.length; i++){
        if(elevator.peoples[i].floorLeav == elevator.floor){
            removePeopleFromEleveatorAndPushToFloor(elevator.peoples[i], elevator, floors[elevator.floor])
            elevator.peoples.splice(i, 1);
            --i;
        }
    }
    // check what peopele must push to elevator
    for(let i = 0; i < floors[elevator.floor].peoples.length; i++){
        if(floors[elevator.floor].peoples[i].floorDirection == elevator.derection){
            if(elevator.peoples.length <= peopleCountInElevator-1){
                elevator.peoples.push(floors[elevator.floor].peoples[i])
                pushPeopleToElevatorAndRemoveFromFloor(floors[elevator.floor].peoples[i], elevator, floors[elevator.floor].floorTex)
                floors[elevator.floor].peoples.splice(i, 1);
                --i;
            }
        }
    }
}
function startPushOnFloor(floor: number, conteiner: any): void {
    let rand = Number(randomNumber(4, 10) + '000');
    // create and push peoeple to the floor 
    setTimeout(function(){
        createPeople(floor, conteiner);
        startPushOnFloor(floor, conteiner);
    }, rand);
}
function renderElevator(elevator: Elevator, positionY: number, direction: boolean): void{
    let coords = { x: 0, y: positionY};
    let tween = new TWEEN.Tween(coords)
      .to({ x: 0, y: direction ? positionY + 100 :  positionY - 100}, 1000)
      .onUpdate(function() {
        elevator.elevatorTex.position.set(coords.x, coords.y);
      })
        .start();
        
      function animate(time: number) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
    }
    requestAnimationFrame(animate);
}
function removePeopleFromEleveatorAndPushToFloor(people: People, elevator: Elevator, floor: Floor): void {
    elevator.elevatorTex.removeChild(people.peopleTex);
    people.peopleTex.x = 200 
    people.peopleTex.y = 100 * floor.floorNumber + 60;
    // FLIT SPRITE
    people.peopleTex.children[1].anchor.x = 1;     
    people.peopleTex.children[1].scale.x *= -1;   
    floor.floorTex.addChild(people.peopleTex);
   // animete to  go left side
    let coords = { x: 200 + randomNumber(10, 50), y: 100 * floor.floorNumber + 60 };
    let tween = new TWEEN.Tween(coords)
      .to({ x: 600, y: 100 * floor.floorNumber + 60}, 2800)
      .onUpdate(function() {
        people.peopleTex.position.set(coords.x, coords.y);
      })
      .onComplete(function(){
        floor.floorTex.removeChild(people.peopleTex);
        })
      .start();
        
      function animate(time: number) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
    }
    requestAnimationFrame(animate);

}
function pushPeopleToElevatorAndRemoveFromFloor(people: People, elevator: Elevator, conteinerFloor: any): void{
    conteinerFloor.removeChild(people.peopleTex);
    people.peopleTex.x = 90 + randomNumber(2, 15)
    people.peopleTex.y = 60
    elevator.elevatorTex.addChild(people.peopleTex);
}
function createPeople(floor: number, conteiner: any): void{
    let floorDirection = randomNumber(0, 1);
    // need this for set correct leavfloor
    if(floor == numberFloor-1){
        floorDirection = 0;
    }else if(floor == 0){
        floorDirection = 1;
    }
    var people = new People(floorDirection, conteiner, floor)
    animatePeople(people);
}
function animatePeople(people: People){
    let coords = { x: 600, y: 100 * people.floor + 60 };
    let tween = new TWEEN.Tween(coords)
      .to({ x: 200 + randomNumber(10, 20), y: 100 * people.floor + 60}, 1800)
      .onUpdate(function() {
        people.peopleTex.position.set(coords.x, coords.y);
      })
      .onComplete(function(){
          // We push to the main array floors only when animation finish
            floors[people.floor].peoples.push(people);
        })
      .start();
        
      function animate(time: number) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
    }
    requestAnimationFrame(animate);
}

function randomNumber(min: number, max: number): number{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
console.log("START ELEVATOR")