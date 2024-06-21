// const http = require(`http`);
// const express = require("express");
// const path = require("path");
// const socketIo = require(`socket.io`);
// const ejs = require("ejs");
// require("dotenv").config();
// const routes = require(`../routes/routes`);
// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server); //here, we initialize the socket.io
// //after importing websocket, we will then need to create a websocket server

// const publicPath = path.join(__dirname, "../public");

// app.set("view engine", "ejs");
// app.use(express.static(publicPath));
// app.use(routes);

// const PORT = process.env.PORT;

// //to save the name of the user

// const users = {};

// //create an object for the list of user sessions that will be stored
// const sessions = {};

// //then we will get an array list that will store the menu
// const menu = [
//   `1. amala and ewedu`,
//   `2. chicken and chips`,
//   `3. beans and plantain`,
//   `4. yam and egg sauce`,
//   `5. pounded yam and egusi soup`,
// ];

// //then we will define the key value pairs of the commands
// const commands = {
//   1: "select 1 to place an order ",
//   99: "select 99 to checkout order",
//   98: "select 98 to see order history",
//   97: "select 97 to see current order",
//   0: "select 0 to cancel order ",
// };

// //now its time to activate the  server to run an an event is triggered
// io.on(`connection`, (socket) => {
//   //   //since we are trying to make each connection unique so we will use socketid to create a unique user id
//   //   const userId = socket.id;
//   //   users[userId] = socket;
//   // //when it recognizes that someone has connected to it , i want it to log a response to the server side
//   // console.log(`A new user has connected!... ${userId}`);
//   // //then while the user is still connected, i want it to send a response
//   // socket.emit(`message`, `welcome ${userId}`); // i can later edit here to just send the list of things the user wants to get

//   console.log(`a new user has connected!`);
//   //when the socket finds theres is a session it checks if the sessions exists and if not, it creates a session saved in the local storage and also adds the order history and the current order to it.... so they can call on each other
//   socket.on(`session`, (sessionId) => {
//     if (!sessions[sessionId]) {
//       sessions[sessionId] = {
//         socketId: socket.id,
//         currentOrder: [],
//         orderHistory: [],
//       };
//       console.log(`new session created: ${sessionId}`);

//       //here, when the socket detects a message from the client side, it sends the commands list and places it in a new line , getting it from the objects.values so it will only display the values of the objects and not the key

//      //formatting the commands
//      let commandsList = Object.values(commands).map((command)=> `${command}`).join(`\n`);

//       socket.emit(
//         `message`,
//         `Welcome, what would you like to do:
//         \n${commandsList}`
//       );
//     } else {
//       //here, we are accessing the socket.id we created initially and assigning it
//       sessions[sessionId].socketId = socket.id;
//       console.log(`existing user: ${sessionId}`);

//      let commandsList = Object.values(commands).map((command)=> `${command}`).join(`\n`);

//       console.log(`Welcome back, what would you like to do:\n${commandsList}`);
//       socket.emit(
//         `message`,
//         `Welcome back, what would you like to do:\n${commandsList}`
//       );
//     }
//   });

//   //After we have initialized the connection, the code below just sends a response when it sees that the client side sent a message
//   socket.on(`message`, (message) => {
//     //here , we are trying to find the session that aligns with this particular socket connection...so we look into the sessions with object.keys which brings out a list of sessions saved , so we use the key of the sessions provided to check if the sessionId we are on matches any in the sessions
//     const sessionId = Object.keys(sessions).find(
//       (key) => sessions[key].socketId === socket.id
//     );
//     if (!sessionId) {
//       return console.log(`session is not found in this socket`);
//     }
//     //now to isolate this current usersession from the list of sessions
//     const userSession = sessions[sessionId];

//     //next we will use switch case which will use the message passed in the client side
//     switch (message) {
//       case `1`:
//         socket.emit(`message`, `Items available to order:\n ${menu}.join(\n)`);
//         break;
//       case `99`:
//         //now, what we want to do is to checkout order, but in doing that, we have to add it to our order history and current order
//         if (userSession.currentOrder.length > 0) {
//           userSession.orderHistory.push([...userSession.currentOrder]);
//           userSession.currentOrder = [];
//           socket.emit(`message`, `Order successfully placed`);
//         } else {
//           socket.emit(`message`, `No order placed, Place one by selecting 1`);
//         }
//         break;
//       case `98`:
//         if (userSession.orderHistory.length > 0) {
//           //now this part is to check our order history since its an array saved in sessions, we use map to navigate it by passing a callback function which takes the order and index, since its an array, we try to add +1 to our index
//           console.log(userSession.orderHistory);

//           let orderHistory = userSession.orderHistory
//             .map((order, index) => 
//               `Order ${index + 1}: ${order.join(`, `)}`
//             )
//             .join(`\n`);

//           socket.emit(`message`, `Order History: \n${orderHistory}`);
//         } else {
//           socket.emit(`message`, `You have no order history`);
//         }
//         break;
//       case `97`:
//         if (userSession.currentOrder.length > 0) {
//           socket.emit(
//             `message`,
//             `Current order: ${userSession.currentOrder.join(`, `)}`
//           );
//         } else {
//           socket.emit(`message`, ` You have no current order`);
//         }
//         break;
//       case `0`:
//         if (userSession.currentOrder.length > 0) {
//           userSession.currentOrder = [];
//           socket.emit(`message`, `Your current order has been cancelled.`);
//         } else {
//           socket.emit(`message`, `You have no order to cancel.`);
//         }
//         break;
//       default:
//         //first, we have to make sure that the message sent to the server is a number(integer) and also make sure its in base10, and also to make it zero base by converting it into array 0 base
//         const menuOrder = parseInt(message, 10) - 1; //returns a number

//         //next is to condition an if statement that will allow us accept orders

//         if (menuOrder >= 0 && menuOrder < menu.length) {
//           userSession.currentOrder.push(menu[menuOrder].substring(3)); //the substring is to remove the number and fullstop and the whitespace so it can only save just the order
//           socket.emit(
//             `message`,
//             `${menu[menuOrder].substring(3)} has been added to your order.`
//           );
//         } else {
//           socket.emit(
//             `message`,
//             `Invalid option, please choose a valid option`
//           );
//         }
//     }
//   });
//      socket.on(`disconnect`, ()=>{
//       console.log(`User disconnected: ${socket.id}`)
//      })
// });

// server.listen(PORT, () => {
//   console.log(`Server is running on port: ${PORT}`);
// });





const http = require('http');
const express = require("express");
const path = require("path");
const socketIo = require('socket.io');
const ejs = require("ejs");
require("dotenv").config();
const routes = require('../routes/routes');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const publicPath = path.join(__dirname, "../public");

app.set("view engine", "ejs");
app.use(express.static(publicPath));
app.use(routes);

const PORT = process.env.PORT;

const users = {};
const sessions = {};

const menu = [
  `1. amala and ewedu`,
  `2. chicken and chips`,
  `3. beans and plantain`,
  `4. yam and egg sauce`,
  `5. pounded yam and egusi soup`,
];

const commands = {
  1: "select 1 to place an order ",
  99: "select 99 to checkout order",
  98: "select 98 to see order history",
  97: "select 97 to see current order",
  0: "select 0 to cancel order ",
};

io.on('connection', (socket) => {
  console.log('a new user has connected!');

  socket.on('session', (sessionId) => {
    if (!sessions[sessionId]) {
      sessions[sessionId] = {
        socketId: socket.id,
        currentOrder: [],
        orderHistory: [],
      };
      console.log(`new session created: ${sessionId}`);

      let commandsList = Object.values(commands).join('\n');
      socket.emit('message', `Welcome, what would you like to do:\n${commandsList}`);
    } else {
      sessions[sessionId].socketId = socket.id;
      console.log(`existing user: ${sessionId}`);

      let commandsList = Object.values(commands).join('\n');
      socket.emit('message', `Welcome back, what would you like to do:\n${commandsList}`);
    }
  });

  socket.on('message', (message) => {
    const sessionId = Object.keys(sessions).find(key => sessions[key].socketId === socket.id);
    if (!sessionId) {
      return console.log('session is not found in this socket');
    }

    const userSession = sessions[sessionId];

    switch (message) {
      case '1':
        socket.emit('message', `Items available to order:\n${menu.join('\n')} \n select 99 to checkout order`);
        break;
      case '99':
        if (userSession.currentOrder.length > 0) {
          userSession.orderHistory.push([...userSession.currentOrder]);
          userSession.currentOrder = [];
          socket.emit('message', 'Order successfully placed \n select 1 to order again');
        } else {
          socket.emit('message', 'No order placed, Place one by selecting 1');
        }
        break;
      case '98':
        if (userSession.orderHistory.length > 0) {
          let orderHistory = userSession.orderHistory
            .map((order, index) => `Order ${index + 1}: ${order.join(', ')}`)
            .join('\n');
          socket.emit('message', `Order History:\n${orderHistory}`);
        } else {
          socket.emit('message', 'You have no order history \n select 1 to order');
        }
        break;
      case '97':
        if (userSession.currentOrder.length > 0) {
          socket.emit('message', `Current order- ${userSession.currentOrder.join(', ')}\n press 99 to checkout order \n press 0 to cancel order`);
        } else {
          socket.emit('message', 'You have no current order');
        }
        break;
      case '0':
        if (userSession.currentOrder.length > 0) {
          userSession.currentOrder = [];
          socket.emit('message', 'Your current order has been cancelled. \n select 1 to order again');
        } else {
          socket.emit('message', 'You have no order to cancel. \n select 1 to order');
        }
        break;
      default:
        const menuOrder = parseInt(message, 10) - 1;
        if (menuOrder >= 0 && menuOrder < menu.length) {
          userSession.currentOrder.push(menu[menuOrder].substring(3));
          socket.emit('message', `${menu[menuOrder].substring(3)} has been added to your order.`);
        } else {
          socket.emit('message', 'Invalid option, please choose a valid option');
        }
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
