import { useState } from "react";
import { Button, Form, Input, Popconfirm, Table, Modal, Switch } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { client } from "../../../../supabase/client";
import { useMessages } from "../../../../hooks/useMessages";
import type { TableColumnsType } from "antd";
import { useServices } from "../../../../hooks/useServices";

interface DataType {
  key: React.Key;
  id?: string;
  nombre_servicio: string;
  costo: number;
  estado: boolean;
}

const ServicesScreen: React.FC = () => {
  const { allServices, setAllServices } = useServices();
  const { showSuccess, showError, showInfo, contextHolder } = useMessages();
  const [currentService, setCurrentService] = useState<DataType | null>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = (service: DataType) => {
    setCurrentService(service);
    form.setFieldsValue({
      ...service,
      estado: service.estado,
    });
    setIsAddingNew(false);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await client
        .from("servicios")
        .delete()
        .eq("id", id)
        .single();

      if (response.status === 200 || response.status === 204) {
        const newData = allServices.filter((item: DataType) => item.id !== id);
        setAllServices(newData);
        showSuccess("Servicio eliminado exitosamente");
      } else {
        showInfo("Por favor intente eliminar este servicio en unos segundos");
      }
    } catch (error) {
      showError(
        "Ocurrió un error en la App, comunícate con el proveedor del software"
      );
    }
  };

  const handleAddNew = () => {
    setCurrentService(null);
    form.resetFields();
    setIsAddingNew(true);
    setIsModalVisible(true);
    form.setFieldsValue({ estado: true }); // Establecer el estado inicial del Switch al crear nuevo servicio
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        costo: parseFloat(values.costo),
        estado: values.estado,
      };

      let updatedFields: Partial<DataType> = {};

      if (currentService) {
        if (
          currentService.nombre_servicio !== formattedValues.nombre_servicio
        ) {
          updatedFields.nombre_servicio = formattedValues.nombre_servicio;
        }
        if (currentService.costo !== formattedValues.costo) {
          updatedFields.costo = formattedValues.costo;
        }
        if (currentService.estado !== formattedValues.estado) {
          updatedFields.estado = formattedValues.estado;
        }
      }

      if (isAddingNew) {
        const response = await client
          .from("servicios")
          .insert([formattedValues]);

        if (response.status === 201) {
          const insertedService: any = response.data?.[0];
          if (insertedService) {
            setAllServices((prevServices: DataType[]) => [
              ...prevServices,
              { ...formattedValues, id: insertedService.id },
            ]);
            showSuccess("Servicio agregado exitosamente");
          } else {
            showInfo(
              "No se recibió la respuesta esperada del servidor al agregar el servicio"
            );
          }
        } else {
          showInfo(
            "Por favor intente agregar esta cita nuevamente en unos segundos"
          );
        }
      } else {
        if (currentService) {
          const response = await client
            .from("servicios")
            .update(updatedFields)
            .eq("id", currentService.id);

          if (
            response.status === 200 ||
            response.status === 204 ||
            response.status === 201
          ) {
            const updatedService = {
              ...currentService,
              ...updatedFields,
            };
            setAllServices((prevServices: DataType[]) =>
              prevServices.map((item: DataType) =>
                item.id === currentService.id ? updatedService : item
              )
            );
            showSuccess("Servicio actualizado exitosamente");
          } else {
            showInfo(
              "Por favor intente actualizar este servicio nuevamente en unos segundos"
            );
          }
        }
      }

      setIsModalVisible(false);
      setCurrentService(null);
    } catch (error) {
      showError(
        "Ocurrió un error en la App, comunícate con el proveedor del software"
      );
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentService(null);
    setIsAddingNew(false);
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "Acciones",
      dataIndex: "operation",
      render: (_, record) =>
        allServices.length >= 1 ? (
          <div className='flex gap-x-3'>
            <Popconfirm
              title='¿Eliminar servicio?'
              onConfirm={() => handleDelete(record.id!)}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </Popconfirm>
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </div>
        ) : null,
    },
    {
      title: "Nombre del servicio",
      dataIndex: "nombre_servicio",
      width: "30%",
    },
    {
      title: "Valor",
      dataIndex: "costo",
    },
    {
      title: "Activo",
      dataIndex: "estado",
      render: (estado: boolean) => <Switch checked={estado} disabled />,
    },
  ];

  return (
    <div>
      {contextHolder}
      <Button
        onClick={handleAddNew}
        type='primary'
        style={{ marginBottom: 16 }}
      >
        Crear servicio
      </Button>
      <Table
        columns={columns}
        dataSource={allServices.map((service: DataType) => ({
          ...service,
          key: service?.id,
        }))}
        size='small'
        pagination={{ pageSize: 5 }}
      />
      <Modal
        title={isAddingNew ? "Agregar servicio" : "Editar servicio"}
        visible={isModalVisible} // Cambiado de open a visible
        onOk={handleSave}
        onCancel={handleCancel}
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            name='nombre_servicio'
            label='Nombre del servicio'
            rules={[
              {
                required: true,
                message: "Por favor ingrese el nombre del servicio",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='costo'
            label='Valor del servicio'
            rules={[
              {
                required: true,
                message: "Por favor ingrese el valor del servicio",
              },
            ]}
          >
            <Input type='number' step='any' />
          </Form.Item>
          <Form.Item name='estado' label='Estado del servicio'>
            <Switch
              checked={form.getFieldValue("estado")}
              onChange={(checked) => form.setFieldsValue({ estado: checked })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServicesScreen;
