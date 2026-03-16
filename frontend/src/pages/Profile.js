import React, {useContext} from "react";
import {AuthContext} from "../context/AuthContext";

function Profile() {
    const { user, loading } = useContext(AuthContext)
    if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Загрузка профиля...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-empty">
        <div className="profile-empty-icon">👤</div>
        <p>Пользователь не найден</p>
      </div>
    );
  }

  // const statusLabels = {
  //   active: 'Активен',
  //   pending: 'На модерации',
  //   banned: 'Заблокирован',
  //   offline: 'Не в сети'
  // };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.username} />
          ) : (
            (user.username?.[0] || 'U').toUpperCase()
          )}
        </div>
        <div className="profile-info">
          <h2>{user.first_name} {user.last_name}</h2>
          <p className="profile-username">@{user.username}</p>
          <div>
            <span className="status-badge active">{user.role}</span>
          </div>
        </div>
      </div>

      <div className="profile-details">
        <div className="profile-detail-item">
          <label>Email</label>
          <span>{user.email}</span>
        </div>
        <div className="profile-detail-item">
          <label>Адрес</label>
          {user.address}
        </div>
        <div className="profile-detail-item">
          <label>Дата регистрации</label>
          <span>{new Date(user.date_joined).toLocaleDateString('ru-RU')}</span>
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn btn-primary">✏️ Редактировать</button>
        <button className="btn">⚙️ Настройки</button>
      </div>
    </div>
  );
}

export default Profile