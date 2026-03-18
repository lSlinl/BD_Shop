import React, { useContext, useState } from "react";
import {useNavigate} from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";

function Profile() {
  const { user, loading, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    address: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Заполняем форму при входе в режим редактирования
  React.useEffect(() => {
    if (isEditing && user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        address: user.address || ''
      });
      setError(null);
      setSuccess(false);
    }
  }, [isEditing, user]);

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Сохранение изменений
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // 🔹 PATCH-запрос к Django API
      const res = await api.patch('auth/update/', formData);

      // 🔹 Обновляем пользователя в контексте
      setUser(res.data);
      
      setSuccess(true);
      setIsEditing(false);
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      setError(err.response?.data?.message || 'Не удалось сохранить изменения');
    } finally {
      setSaving(false);
    }
  };

  // Отмена редактирования
  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(false);
  };

  // Переход к заказам
  const handleOrdersClick = () => {
    navigate('/orders');
  };

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

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.username} />
          ) : (
            (user.username?.[0] || user.first_name?.[0] || user.last_name?.[0] || 'U').toUpperCase()
          )}
        </div>
        <div className="profile-info">
          <h2>
            {user.first_name || user.last_name 
              ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
              : user.username}
          </h2>
          <p className="profile-username">@{user.username}</p>
          <div>
            <span className="status-badge active">{user.role}</span>
          </div>
        </div>
      </div>

      {/* Уведомления */}
      {error && (
        <div className="profile-alert error">❌ {error}</div>
      )}
      {success && (
        <div className="profile-alert success">✅ Изменения сохранены!</div>
      )}

      {/* Режим просмотра */}
      {!isEditing ? (
        <>
          <div className="profile-details">
            <div className="profile-detail-item">
              <label>Email</label>
              <span>{user.email}</span>
            </div>
            <div className="profile-detail-item">
              <label>Адрес</label>
              <span>{user.address || '—'}</span>
            </div>
            <div className="profile-detail-item">
              <label>Дата регистрации</label>
              <span>{new Date(user.date_joined).toLocaleDateString('ru-RU')}</span>
            </div>
          </div>

          <div className="profile-actions">
            <button 
              className="btn btn-primary" 
              onClick={() => setIsEditing(true)}
            >
              ✏️ Редактировать
            </button>
            <button className="btn" onClick={handleOrdersClick}>
              📦 Заказы
            </button>
          </div>
        </>
      ) : (
        /* Режим редактирования */
        <form onSubmit={handleSave} className="profile-form">
          <div className="profile-section">
            <h3>Личные данные</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name">Имя</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Введите имя"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="last_name">Фамилия</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Введите фамилию"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Адрес</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Город, улица, дом, квартира"
              />
            </div>
          </div>

          <div className="profile-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Сохранение...' : '💾 Сохранить'}
            </button>
            <button 
              type="button" 
              className="btn"
              onClick={handleCancel}
              disabled={saving}
            >
              ✕ Отмена
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Profile;