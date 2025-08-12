import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Typography, Alert, Card } from 'antd';
import Auth from '../services/Auth.js';

const { Title, Text } = Typography;

const App = () => {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Obtener el token desde la URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    setToken(t);
  }, []);

  const onFinish = async (values) => {
    const { newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      setStatus('error');
      setMessage('Las contraseñas no coinciden');
      return;
    }

    if (!token) {
      setStatus('error');
      setMessage('Token inválido o ausente en la URL');
      return;
    }

    setLoading(true);
    try {
      const response = await Auth.resetPassword({ token, newPassword });

      if (response.success) {
        setStatus('success');
        setMessage(response.message || 'Contraseña cambiada con éxito');
      } else {
        setStatus('error');
        setMessage(response.message || 'No se pudo cambiar la contraseña');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage(error?.response?.data?.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 16px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ width: '100%', maxWidth: 560 }}>
        <Card
          bordered={false}
          style={{
            width: '100%',
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Title level={3} style={{ textAlign: 'center', marginBottom: 16 }}>
            🔐 Cambiar contraseña
          </Title>
          <Text type="secondary">
            Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta.
          </Text>

          <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 24 }}>
            <Form.Item
              label="Nueva contraseña"
              name="newPassword"
              rules={[
                { required: true, message: 'Por favor ingresa una nueva contraseña' },
                { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Confirmar contraseña"
              name="confirmPassword"
              rules={[
                { required: true, message: 'Por favor confirma tu nueva contraseña' },
                { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Cambiar contraseña
              </Button>
            </Form.Item>
          </Form>

          {status && (
            <Alert
              message={message}
              type={status}
              showIcon
              style={{ marginTop: 16 }}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default App;
