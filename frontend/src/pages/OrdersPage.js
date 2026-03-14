import React, {useEffect, useState, useContext} from "react";
import {AuthContext} from "../context/AuthContext";
import api from "../api/api";

function OrdersPage() {
    const {access} = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            if (!access) return;
            try {
                const response = await api.get("orders/my-orders/");

                const ordersData = response.data.results || response.data || [];
                setOrders(ordersData);

            } catch (error) {
                console.error("Ошибка при загрузке заказов:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, [access]);

    if (loading) return <p>Загрузка заказов...</p>;
    if (orders.length === 0) return <p>У вас пока нет заказов.</p>;

    return (
        <div style={{padding: "24px"}}>
            <h2 style={{ textAlign: "center", color: "rgba(126, 87, 194, 0.4)" }}>История заказов</h2>
            {/*        <pre style={{ background: '#222', padding: '12px', borderRadius: '8px', overflow: 'auto', maxHeight: '300px' }}>*/}
            {/*  {JSON.stringify(orders, null, 2)}*/}
            {/*</pre>*/}
            {orders.slice().reverse().map(order => (
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
                    <p><b>Дата:</b> {order.created_at ? new Date(order.created_at).toLocaleString('ru-RU') : '—'}</p>
                    <p><b>Адрес:</b> {order.address || '—'}</p>
                    <p><b>Комментарий:</b> {order.comment || '—'}</p>
                    <p><b>Статус:</b> {order.status || '—'}</p>
                    <p><b>Итого:</b> {order.total || 0} silver</p>

                    <h4>Товары:</h4>
                    {order.items?.length > 0 ? (
                        <ul style={{paddingLeft: "24px", listStyleType: "disc"}}>
                            {order.items.map((item, index) => (
                                <li key={index}>
                                    {item.item?.name || item.name || '—'} × {item.quantity || 1} ={' '}
                                    {(item.price || 0) * (item.quantity || 1)} silver
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Товары отсутствуют</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default OrdersPage;
