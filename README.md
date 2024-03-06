# Game Backend README

## Overview

This README provides an overview of the backend system for our game. It explains the features, APIs, and middleware used.

## Technologies Used

- **Language**: Node.js
- **Framework**: Express.js
- **Library**: npm, Mongoose, Socket.io

## Features

### Admin Management

- **Create Admin**: The system automatically creates an admin when the server starts. Admins can view all users and block/unblock them.
- **Admin Login**: Admin login returns a device ID, stored in local storage for authentication.

### Socket.io Methods

- **Broadcast**: This must be called after every socket endpoint to receive responses from all methods.

### Room Management

- **Enter Room**: Users can enter a room by passing a device ID. If the room exists, the user joins; if not, a new room is created.
- **On Chips Put**: Broadcasts data passed in the body.
- **Discard Room**: Automatically discards a room, deducts credits from losers, and adds them to the winner's table.
- **User Win**: Same as "Discard Room".

### Room Amount Management

- **Create Amount**: Admins can create amounts for tables.
- **Update Amount**: Admins can update amounts.
- **Delete Amount**: Admins can delete amounts.
- **Get Amount**: Both admins and users can view available amounts for tables.

### User Management

- **Create User**: Pass device ID in the body to create a new user or return existing data.
- **Update User**: Update user details.
- **Delete User**: Delete user details.
- **Get User**: Get details of a single user.
- **Get User List**: Get details of all users (admin-only).

## Middleware

- **Authentication**: Middleware for storing a device ID (token) in local storage. Backend identifies users or admins based on this token.

## Note

Ensure to call the "broadcast" method after every socket.io endpoint to receive responses correctly.

For detailed information on each API endpoint, refer to the API documentation.
