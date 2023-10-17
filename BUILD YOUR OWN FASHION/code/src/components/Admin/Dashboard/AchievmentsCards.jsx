import React from 'react';
import dashboardcss from '../../../assets/styles/AdminStyles/dashboard.module.css'

function AchievementCard({ label, value }) {
    return (
        <div className={dashboardcss.achievement_card}>
            <div className={dashboardcss.achievement_value}>{value}</div>
            <div className={dashboardcss.achievement_label}>{label}</div>
        </div>
    );
}

function AchievementCards({ achievements }) {
    return (
        <div className={dashboardcss.cards_container}>
            {achievements.map((achievement, index) => (
                <AchievementCard key={index} label={achievement.label} value={achievement.value} />
            ))}
        </div>
    );
}

export default AchievementCards;
