# Who Is The Spy
[](https://spy.indieraydev.com)

Playing Who Is The Spy is as close to being a real spy as you ever want. Each round will have your heart pumping and your mind racing as you try to figure out, who is the spy? The catch is that it might just be you.

> Note: This game is a work in progress. Since it started as a react and websocket proof of concept, not all functionality has been implemented yet.

## Inspiration
Who Is The Spy was a very popular game in China and resembles the desktop game, Spyfall (created by Alexandr Ushan). The game has even been used as a way to help foreign language students develop their vocabulary and basic conversational skills.

This app aims to facilitate the setup and gameplay so that groups do not need to designate a moderator.

## How To Play

### Goal
Each player will be given a secret word. All of the players' secret words match except for one.

The player with the mismatched word is the spy, and must avoid detection or uncover the secret.

The other players must try to deduce who is the spy without letting them learn the.

### Setup
One player will need to create a room by visiting [spy.indieraydev.com](https://spy.indieraydev.com). Once the room is created, the creator will be redirected to the room at

> https://spy.indieraydev.com/`[room-code]`

The new room url can be shared with the other players, or they can enter the `[room-code]` on the main page.

If it is your first time visiting [spy.indieraydev.com](https://spy.indieraydev.com), you will be asked to register by entering your name. This is necessary so that the other players can identify who has joined the game, who they are voting against, and can help keep track of who has been eliminated in each round.

Before the game begins, everyone who wishes to play must mark themselves "ready".

Once two or more players are "ready", the players can choose to start the game. Please be careful nd only start the game once everyone has had a chance to sign up and mark themselves "ready". Anyone in the lobby who has not been marked "ready" will not be given a secret word, and will be listed as a spectator.

> Note: The app only includes functinality up to this point. Secret word generation and role assignment must be implemented before the game is playable.

### Gameplay
Once the game starts, each player can discretely check their secret word. This word must not be shared.

Each player takes turns making statements as clues about their word. The statements must be factual of the word they posess. As a general strategy, clues should be specific enough to signal to others that you are not a spy, but be general enough to not help the spy. ... But don't be too general, or everyone will suspect you!

Once all players have given clues, players are given two options.

1) A player who thinks they are the spy may attempt to guess the real secret word.
2) Vote for one other player to be eliminated.

If the spy correctly guesses the secret, they win. However, if they are wrong, they lose and the game end. If a non-spy guesses, they are automatically eliminated. If the spy does not make a guess, then the player with the most votes is eliminated. If there is a tie, no players are eliminated.

Each round continues until either the spy is eliminated (spy loses), or there are only two players left (spy wins).
