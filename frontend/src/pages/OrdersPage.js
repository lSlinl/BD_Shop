import React, {useEffect, useState, useContext} from "react";
import {AuthContext} from "../context/AuthContext";
import api from "../api/api";

function OrdersPage() {
    const {user, access} = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null)

    useEffect(() => {
        async function fetchOrders() {
            if (!access) {
                setLoading(false)
                return;
            }
            try {
                let response;
                if (user?.role === 'admin') {
                    response = await api.get('orders/order_admin/');
                } else {
                    response = await api.get("orders/my-orders/");
                }

                const ordersData = response.data.results || response.data || [];
                if (Array.isArray(ordersData)) {
                    setOrders(ordersData);
                } else {
                    setOrders([])
                }

            } catch (error) {
                console.error("Ошибка при загрузке заказов:", error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('access_token');
                    window.location.href = '/login';
                }
                setOrders([])
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, [access, user]);

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdating(orderId);
        try {
            const response = await api.patch(`orders/order_admin/${orderId}/`, {status: newStatus});
            setOrders(prevOrders =>
                prevOrders.map(order => order.id === orderId ? {...order, ...response.data} : order)
            );
        } catch (error) {
            console.error("Ошибка при смене статуса:", error);
            alert("Не удалось обновить статус");
        } finally {
            setUpdating(null)
        }
    };

    if (loading) return <p>Загрузка заказов...</p>;
    if (!access) return <p>Войдите в аккаунт</p>;

    return (
        <div style={{padding: "24px"}}>
            <h2 style={{textAlign: "center", color: "rgba(126, 87, 194, 0.4)"}}>История заказов</h2>
            {Array.isArray(orders) && orders.length > 0 ? (
                orders.slice().reverse().map(order => (
                    <div
                        key={order.id}
                        style={{
                            border: "1px solid #444",
                            padding: "16px",
                            marginBottom: "16px",
                            borderRadius: "8px",
                            background: "#1a1a1f",
                            width: '50%',
                            margin: "0 auto"
                        }}
                    >
                        <p><b>№ заказа:</b> {order.id}</p>
                        <p><b>Дата:</b> {order.date ? new Date(order.date).toLocaleString('ru-RU') : '—'}</p>
                        <p><b>Адрес:</b> {order.address || '—'}</p>
                        <p><b>Комментарий:</b> {order.comment || '—'}</p>
                        <p><b>Статус:</b> {''}
                            {user?.role === 'admin' ? (
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    disabled={updating === order.id}
                                    style={{
                                        background: "#2a2a2f",
                                        color: "#fff",
                                        border: "1px solid #7e57c2",
                                        borderRadius: "4px",
                                        padding: "2px 5px",
                                        cursor: "pointer"
                                    }}
                                >
                                    <option value="pending">Ожидает</option>
                                    <option value="processing">В обработке</option>
                                    <option value="completed">Завершен</option>
                                    <option value="cancelled">Отменен</option>

                                </select>
                            ) : (
                                <span>{order.status || '—'}</span>
                            )}
                        </p>
                        <p><b>Итого:</b> {order.total || 0} silver</p>

                        <p>{user?.role === 'admin' ? (<span><b>Добавил:</b>{order.user_username}</span>) : ('')}</p>


                        <h4>Товары:</h4>
                        {order.items?.length > 0 ? (
                            <ul style={{paddingLeft: "24px", listStyleType: "disc"}}>
                                {order.items.map((item, index) => (
                                    <li key={item.id || index}>
                                        {item.item?.name || item.name || '—'} × {item.quantity || 1} ={' '}
                                        {(item.price || 0) * (item.quantity || 1)} silver
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Товары отсутствуют</p>
                        )}
                    </div>
                ))
            ) : (
                <p>У вас пока нет заказов</p>
            )}
        < /div>
    );
}

export default OrdersPage;
