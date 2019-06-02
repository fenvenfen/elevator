var app = new PIXI.Application({
    width: 800,
    height: 1100,
    antialias: true,
    backgroundColor: 0xced6e2
});
document.body.appendChild(app.view);
var Elevator = (function () {
    function Elevator(etaz, peoples, derection) {
        this.etaz = etaz;
        this.peoples = peoples;
        this.derection = derection;
        this.elevatorTex = this.createElevator();
    }
    ;
    Elevator.prototype.createElevator = function () {
        var elevatorTex = new PIXI.Container();
        var elevatoImg = PIXI.Sprite.from('img/elevator.png');
        elevatoImg.width = 130;
        elevatoImg.height = 130;
        elevatorTex.addChild(elevatoImg);
        elevatoImg.x = 50;
        elevatoImg.y = 0;
        app.stage.addChild(elevatorTex);
        return elevatorTex;
    };
    return Elevator;
}());
var Floor = (function () {
    function Floor(peoples, floorNumber) {
        this.peoples = peoples;
        this.floorNumber = floorNumber;
        this.floorTex = this.createFloor();
    }
    ;
    Floor.prototype.createFloor = function () {
        var levelFloorText = new PIXI.Text('Level ' + (this.floorNumber) + '');
        var floorTex = new PIXI.Container();
        var height = this.floorNumber * 100 + 10;
        levelFloorText.x = 600;
        levelFloorText.y = height;
        floorTex.addChild(levelFloorText);
        app.stage.addChild(floorTex);
        var graphics = new PIXI.Graphics();
        graphics.lineStyle(2, 0xff00ff, 1);
        graphics.beginFill(0xff00bb, 0.25);
        graphics.drawRoundedRect(200, height, 500, 100, 1);
        graphics.endFill();
        floorTex.addChild(graphics);
        return floorTex;
    };
    return Floor;
}());
var People = (function () {
    function People(floorDirection, conteiner, floor, floorLeav) {
        this.floorDirection = floorDirection ? "UP" : "DOWN";
        this.floorLeav = floorDirection ? randomNumber(floor + 1, numberFloor - 1) : randomNumber(0, floor - 1);
        this.floor = floor;
        this.peopleTex = this.createPeople(conteiner);
    }
    ;
    People.prototype.createPeople = function (conteiner) {
        var style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 13,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff', '#00ff99'],
            stroke: '#4a1850',
            strokeThickness: 5,
            wordWrap: true,
            wordWrapWidth: 440,
        });
        var textpeople = new PIXI.Text((this.floorLeav) + '' + (this.floorDirection), style);
        var mainPeopleTex = new PIXI.Container();
        var peopleTex = PIXI.Sprite.from('img/Ghera.png');
        textpeople.x = 0;
        textpeople.y = -20;
        mainPeopleTex.addChild(textpeople);
        peopleTex.width = 50;
        peopleTex.height = 50;
        mainPeopleTex.x = 600;
        mainPeopleTex.y = 100 * this.floor;
        mainPeopleTex.addChild(peopleTex);
        conteiner.addChild(mainPeopleTex);
        return mainPeopleTex;
    };
    return People;
}());
var numberFloor = 7;
var timeForElevar = 1000;
var floors = [];
var peopleCountInElevator = 4;
var positionY = 0;
function init() {
    peopleCountInElevator = document.getElementById("elevatorCount").value ? document.getElementById("elevatorCount").value : peopleCountInElevator;
    numberFloor = document.getElementById("floorCount").value ? document.getElementById("floorCount").value : numberFloor;
    for (var i = 0; i < numberFloor; i++) {
        var floor = new Floor([], i);
        floors.push(floor);
        startPushOnFloor(i, floor.floorTex);
    }
    moveElevator(timeForElevar);
}
function moveElevator(moveTime) {
    var elevator = new Elevator(0, [], "UP");
    startElevatorMove(moveTime);
    function startElevatorMove(moveTime) {
        if (!floors[elevator.etaz].peoples.length) {
            var moveTime = 1000;
        }
        else {
            var moveTime = 1800;
        }
        setTimeout(function () {
            if (elevator.etaz == numberFloor - 1) {
                elevator.derection = "DOWN";
            }
            if (elevator.etaz == 0) {
                elevator.derection = "UP";
            }
            statePosition(elevator);
            if (elevator.derection == "UP") {
                renderElevator(elevator, positionY, true);
                positionY = positionY + 100;
                elevator.etaz++;
            }
            else {
                renderElevator(elevator, positionY, false);
                positionY = positionY - 100;
                elevator.etaz--;
            }
            startElevatorMove(moveTime);
        }, moveTime);
    }
}
function statePosition(elevator) {
    for (var i = 0; i < elevator.peoples.length; i++) {
        if (elevator.peoples[i].floorLeav == elevator.etaz) {
            removePeopleFromEleveatorAndPushToFloor(elevator.peoples[i], elevator, floors[elevator.etaz]);
            elevator.peoples.splice(i, 1);
            --i;
        }
    }
    for (var i_1 = 0; i_1 < floors[elevator.etaz].peoples.length; i_1++) {
        if (floors[elevator.etaz].peoples[i_1].floorDirection == elevator.derection) {
            if (elevator.peoples.length <= peopleCountInElevator - 1) {
                elevator.peoples.push(floors[elevator.etaz].peoples[i_1]);
                pushPeopleToElevatorAndRemoveFromFloor(floors[elevator.etaz].peoples[i_1], elevator, floors[elevator.etaz].floorTex);
                floors[elevator.etaz].peoples.splice(i_1, 1);
                --i_1;
            }
        }
    }
}
function startPushOnFloor(floor, conteiner) {
    var rand = Number(randomNumber(4, 10) + '000');
    setTimeout(function () {
        createPeople(floor, conteiner);
        startPushOnFloor(floor, conteiner);
    }, rand);
}
function renderElevator(elevator, positionY, direction) {
    var coords = { x: 0, y: positionY };
    var tween = new TWEEN.Tween(coords)
        .to({ x: 0, y: direction ? positionY + 100 : positionY - 100 }, 1000)
        .onUpdate(function () {
        elevator.elevatorTex.position.set(coords.x, coords.y);
    })
        .start();
    function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
    }
    requestAnimationFrame(animate);
}
function removePeopleFromEleveatorAndPushToFloor(people, elevator, floor) {
    elevator.elevatorTex.removeChild(people.peopleTex);
    people.peopleTex.x = 200;
    people.peopleTex.y = 100 * floor.floorNumber + 60;
    people.peopleTex.children[1].anchor.x = 1;
    people.peopleTex.children[1].scale.x *= -1;
    floor.floorTex.addChild(people.peopleTex);
    var coords = { x: 200 + randomNumber(10, 50), y: 100 * floor.floorNumber + 60 };
    var tween = new TWEEN.Tween(coords)
        .to({ x: 600, y: 100 * floor.floorNumber + 60 }, 2800)
        .onUpdate(function () {
        people.peopleTex.position.set(coords.x, coords.y);
    })
        .onComplete(function () {
        floor.floorTex.removeChild(people.peopleTex);
    })
        .start();
    function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
    }
    requestAnimationFrame(animate);
}
function pushPeopleToElevatorAndRemoveFromFloor(people, elevator, conteinerFloor) {
    conteinerFloor.removeChild(people.peopleTex);
    people.peopleTex.x = 90 + randomNumber(2, 15);
    people.peopleTex.y = 60;
    elevator.elevatorTex.addChild(people.peopleTex);
}
function createPeople(floor, conteiner) {
    var floorDirection = randomNumber(0, 1);
    if (floor == numberFloor - 1) {
        floorDirection = 0;
    }
    else if (floor == 0) {
        floorDirection = 1;
    }
    var people = new People(floorDirection, conteiner, floor);
    animatePeople(people);
}
function animatePeople(people) {
    var coords = { x: 600, y: 100 * people.floor + 60 };
    var tween = new TWEEN.Tween(coords)
        .to({ x: 200 + randomNumber(10, 20), y: 100 * people.floor + 60 }, 1800)
        .onUpdate(function () {
        people.peopleTex.position.set(coords.x, coords.y);
    })
        .onComplete(function () {
        floors[people.floor].peoples.push(people);
    })
        .start();
    function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
    }
    requestAnimationFrame(animate);
}
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
console.log("START ELEVATOR");
