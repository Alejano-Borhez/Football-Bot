//
//

function getPlayerMove(data) {
var playerNumber = data.playerIndex;
var currentPlayer = data.yourTeam.players[playerNumber];
var ball = data.ball;
var ballStop = getBallStats(ball, data.settings);
var direction = currentPlayer.direction;
var velocity = currentPlayer.velocity;
var goalsDelta = data.yourTeam.goals >= data.opponentTeam.goals;
var goalKeeperZoneWidth
var maxPlayerX = data.settings.field.width * [(goalsDelta) ? 1/6 : 1, 1, 1][playerNumber]

const ballRadius = ball.settings.radius;
if (currentPlayer.x < maxPlayerX) {//Игра нападающих 1,2 номер
if (ballStop.x < currentPlayer.x) {//Подбор мяча позади нападающего
    if (currentPlayer.x - ballStop.x < ballRadius) {//
        var stopPoint = {
        x: ballStop.x - ballRadius * 5,
        y: ballStop.y + (ballStop.y > currentPlayer.y ?  - ballRadius : + ballRadius) * 5
        }
        direction = getDirectionTo(currentPlayer, stopPoint);
        velocity = data.settings.player.maxVelocity;
    }
     else {//
        var stopPoint = {
        x: ballStop.x - ballRadius * 3,
        y: ballStop.y + (ballStop.y > currentPlayer.y ?  - ballRadius : + ballRadius) * 3
        }
        direction = getDirectionTo(currentPlayer, stopPoint);
        velocity = data.settings.player.maxVelocity;}
}
 else {//Удар по мячу в сторону ворот противника
    if (ball.x - currentPlayer.x < ballRadius) {//
        var stopPoint = {
        x: ball.x + ballRadius,
        y: ball.y + (ball.y > currentPlayer.y ?  - ballRadius : + ballRadius)
        }
        direction = getDirectionTo(currentPlayer, stopPoint);
        velocity = getDistance(currentPlayer, stopPoint);
    } else {//
        direction = getDirectionTo(currentPlayer, ballStop);
        velocity = data.settings.player.maxVelocity;
        }
    }
}
 else {//Игра вратаря
    if (ballStop.x - currentPlayer.x < maxPlayerX) {//Если мяч близко
        if (ballStop.x < currentPlayer.x) {//Играем, как нападающий, подбор мяча
            if (currentPlayer.x - ballStop.x < ballRadius) {//
                var stopPoint = {
                x: ballStop.x - ballRadius * 5,
                y: ballStop.y + (ballStop.y > currentPlayer.y ?  - ballRadius : + ballRadius) * 5
                }
                direction = getDirectionTo(currentPlayer, stopPoint);
                velocity = data.settings.player.maxVelocity;
            } else {//
                var stopPoint = {
                x: ballStop.x - ballRadius * 3,
                y: ballStop.y + (ballStop.y > currentPlayer.y ?  - ballRadius : + ballRadius) * 3
                }
                direction = getDirectionTo(currentPlayer, stopPoint);
                velocity = data.settings.player.maxVelocity;}
        } else {//Выбиваем мяч от ворот
            if (ball.x - currentPlayer.x < ballRadius) {//
                var stopPoint = {
                x: ballStop.x + ballRadius,
                y: ballStop.y + (ballStop.y > currentPlayer.y ?  - ballRadius : + ballRadius)
                }
                direction = getDirectionTo(currentPlayer, stopPoint);
                velocity = getDistance(currentPlayer, stopPoint);
            } else {//
                var stopPoint = {
                x: ballStop.x - ballRadius/2,
                y: ball.y
                };
                direction = getDirectionTo(currentPlayer, stopPoint);
                velocity = data.settings.player.maxVelocity;
                }
            }
    } else {//Болтаемся без дела у ворот
     var stopPoint = {
        x: currentPlayer.x - ballRadius * 3,
        y: ballStop.y
        };
    direction = getDirectionTo(currentPlayer, stopPoint);
    velocity = data.settings.player.maxVelocity;
    }
}

return {
direction: direction,
velocity: velocity
};
}

function getBallStats(ball, gameSettings) {
var stopTime = getStopTime(ball);
var stopDistance = ball.velocity * stopTime
- ball.settings.moveDeceleration * (stopTime + 1) * stopTime / 2;
var x = ball.x + stopDistance * Math.cos(ball.direction);
var y = Math.abs(ball.y + stopDistance * Math.sin(ball.direction));
if (y > gameSettings.field.height) y = 2 * gameSettings.field.height - y;
return { stopTime, stopDistance, x, y };
}

function getStopTime(ball) {
return ball.velocity / ball.settings.moveDeceleration;
}

function getDirectionTo(startPoint, endPoint) {
return Math.atan2(endPoint  .y - startPoint.y, endPoint.x - startPoint.x);
}

function getDistance(point1, point2) {
return Math.hypot(point1.x-point2.x, point1.y - point2.y);
}

onmessage = (e) => postMessage(getPlayerMove(e.data));
