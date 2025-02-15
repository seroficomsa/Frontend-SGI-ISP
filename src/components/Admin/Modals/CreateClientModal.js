import React from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";

const { Option } = Select;

export default function CreateClientModal({ visible, onCancel, onCreate }) {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        onCreate(values);
        form.resetFields();
    };

    return (
        <Modal
            visible={visible}
            title="Crear Cliente"
            onCancel={onCancel}
            onOk={() => form.submit()}
            okText="Crear"
            cancelText="Cancelar"
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item name="nombres" label="Nombres" rules={[{ required: true, message: "Ingrese los nombres" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="apellidos" label="Apellidos" rules={[{ required: true, message: "Ingrese los apellidos" }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="correo_electronico"
                    label="Correo Electrónico"
                    rules={[{ required: true, message: "Ingrese un correo válido", type: "email" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="estado" label="Estado" rules={[{ required: true, message: "Seleccione un estado" }]}>
                    <Select>
                        <Option value="A">Activo</Option>
                        <Option value="I">Inactivo</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="fecha_nacimiento" label="Fecha de Nacimiento">
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>
            </Form>
        </Modal>
    );
}
