// src/App.js
import React, { useState, useEffect } from "react";
import jumpingJackGif from "./assets/jumpingjack.gif";
import "./App.css"; // Import the CSS file

const initialPlayers = [
  { id: 1, name: "PlayerOne", score: 120, avatar: "🚴" },
  { id: 2, name: "FitFriend", score: 95, avatar: "🏃" },
];

const dailyQuests = [
  "Complete 100 jumping jacks",
  "Burn 300 calories",
  "Earn 50 energy points",
];

function App() {
  const [players, setPlayers] = useState(initialPlayers);
  const [myScore, setMyScore] = useState(0);
  const [energyPoints, setEnergyPoints] = useState(0);
  const [currentQuest, setCurrentQuest] = useState(dailyQuests[0]);
  const [achievements, setAchievements] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [socialMessage, setSocialMessage] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const pointsEarned = Math.floor(Math.random() * 10) + 5; // 5 to 14
      setMyScore((score) => score + pointsEarned);
      setEnergyPoints((ep) => ep + pointsEarned);
      setFeedback(`Great! You earned ${pointsEarned} points!`);

      if (myScore + pointsEarned > 100 && !achievements.includes("Centurion")) {
        setAchievements((a) => [...a, "Centurion"]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [achievements, myScore]);

  const completeQuest = () => {
    setSocialMessage(`I just completed the quest: "${currentQuest}" with FitPlay!`);
    const currentIndex = dailyQuests.indexOf(currentQuest);
    setCurrentQuest(
      currentIndex < dailyQuests.length - 1 ? dailyQuests[currentIndex + 1] : dailyQuests[0]
    );
  };

  return (
    <div className="App">
      <header>
        <h1>FitPlay Multiplayer Fitness Game</h1>
        <p>Energy Points: {energyPoints} ⚡</p>
      </header>

      <section>
        <h2>Daily Quest</h2>
        <p>{currentQuest}</p>
        <button onClick={completeQuest}>Complete Quest</button>
      </section>

      <section>
        <h2>Workout Character</h2>
        <img
          src={jumpingJackGif}
          alt="Jumping Jack Character"
          style={{
            width: 200,
            height: "auto",
            transform: `scale(${1 + energyPoints / 100})`, // scale grows with points
          }}
        />
      </section>

      <section>
        <h2>Player Stats & Feedback</h2>
        <p>My Score: {myScore}</p>
        <p>{feedback}</p>
      </section>

      <section>
        <h2>Achievements</h2>
        {achievements.length === 0 ? (
          <p>No achievements yet.</p>
        ) : (
          <ul>
            {achievements.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Multiplayer Leaderboard</h2>
        <ul>
          {players
            .sort((a, b) => b.score - a.score)
            .map((p) => (
              <li key={p.id}>
                {p.avatar} {p.name}: {p.score} points
              </li>
            ))}
        </ul>
      </section>

      <section>
        <h2>Social Sharing</h2>
        {socialMessage ? <p>{socialMessage}</p> : <p>No recent shares</p>}
        <button
          onClick={() => alert("Shared on social media: " + socialMessage)}
          disabled={!socialMessage}
          style={{ marginTop: 5 }}
        >
          Share
        </button>
      </section>
    </div>
  );
}

export default App;
