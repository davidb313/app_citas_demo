import { useCallback, useEffect, useState } from "react";
import { Button, Form, Input, Popconfirm, Table, Modal, Switch } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { client } from "../../../../supabase/client";
import { useMessages } from "../../../../hooks/useMessages";
import type { TableColumnsType } from "antd";
import { useServices } from "../../../../hooks/useServices";
import {
  deleteService,
  getServices,
  insertService,
  updateService,
} from "../../api/services/service.service";
import { Spinner } from "../../../../components";

interface DataType {
  key: React.Key;
  id?: string;
  nombre_servicio: string;
  costo: number;
  estado: boolean;
}

const ServicesScreen: React.FC = () => {
  const { showSuccess, showError, showInfo, contextHolder } = useMessages();
  const [currentService, setCurrentService] = useState<DataType | null>(null);
  const [allServices, setAllServices] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [form] = Form.useForm();

  const getAllServices = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getServices();
      setAllServices(response ? response : []);
      // setSaved(true);
      setIsLoading(false);
    } catch (err) {
      showError(
        "No se pudieron cargar los servicios, contacte al proveedor del software"
      );
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    getAllServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      const response = await deleteService(id);
      if (response) {
        showSuccess("Servicio eliminado exitosamente");
        await getAllServices();
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
    form.setFieldsValue({ estado: true });
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
        // Insert
        const response = await insertService(formattedValues);
        if (response) showSuccess("Servicio agregado exitosamente");
      } else {
        // update
        const response = await updateService(
          updatedFields,
          currentService?.id ?? ""
        );
        if (response) showSuccess("Servicio actualizado exitosamente");
      }
      await getAllServices();

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
          <div className="flex gap-x-3">
            <Popconfirm
              title="¿Eliminar servicio?"
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
      {isLoading ? (
        <Spinner />
      ) : (
        <div>
          {contextHolder}
          <Button
            onClick={handleAddNew}
            type="primary"
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
            size="small"
            pagination={{ pageSize: 5 }}
          />
          <Modal
            title={isAddingNew ? "Agregar servicio" : "Editar servicio"}
            visible={isModalVisible} // Cambiado de open a visible
            onOk={handleSave}
            onCancel={handleCancel}
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name="nombre_servicio"
                label="Nombre del servicio"
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
                name="costo"
                label="Valor del servicio"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese el valor del servicio",
                  },
                ]}
              >
                <Input type="number" step="any" />
              </Form.Item>
              <Form.Item name="estado" label="Estado del servicio">
                <Switch
                  onChange={(checked) =>
                    form.setFieldsValue({ estado: checked })
                  }
                />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default ServicesScreen;
