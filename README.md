# Room module
This module was been created to manage the room domain of the application.

## Desing
The module use the architechture called **Clean Architecture**, based on the boilerplate [clean-node](https://github.com/gh0stl1m/clean-node)

## Entities
The domain contain one entities:
- Room: This entitie contains the basic the information of the games and players.

## UseCases
The use cases contains all the business rules for the room entity, for the case of this module we have:
- Room: Contains all the business rules for the room, like a create, store games and store winners of each round.

## Drivers
The drivers contains only the connection with the [MongDB Connection Module](https://github.com/gh0stl1m/rps-mongoconnection-module).

## Interfaces
The interface expose to another modules the methods which are going to be used for the services.

> **Note:** The module is part of the Game of Drones ecosystem, it it a technical test for the company UruIT.