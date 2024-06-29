import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Popconfirm,
  Table,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Select,
} from "antd";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useMessages } from "../../../../hooks/useMessages";
import { useServices } from "../../../../hooks/useServices";
import {
  IAppointment,
  deleteAppointment,
  getAppointments,
  insertAppointment,
  updateAppointment,
} from "../../api/services/appointment.service";
import { Spinner } from "../../../../components";

dayjs.extend(customParseFormat);
dayjs.extend(utc);

const AppointmentsTable: React.FC = () => {
  const [allAppointments, setAllAppointments] = useState<any>([]);

  const { allServices } = useServices();
  const { showSuccess, showError, showInfo, contextHolder } = useMessages();
  const [isLoading, setIsLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAppointment, setCurrentAppointment] =
    useState<IAppointment | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [form] = Form.useForm();

  const getAllAppointments = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAppointments();
      const transformedData = response?.map((item: any) => ({
        ...item,
        servicio_solicitado: item?.servicio_solicitado?.nombre_servicio,
      }));
      setAllAppointments(transformedData ? transformedData : []);
      setIsLoading(false);
    } catch (err) {
      showError(
        "No se pudieron cargar las citas, contacte al proveedor del software"
      );
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    getAllAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteAppointment(id);
      if (response) {
        showSuccess("Servicio eliminado exitosamente");
        await getAllAppointments();
      } else {
        showInfo("Por favor intente eliminar este servicio en unos segundos");
      }
    } catch (error) {
      showError(
        "Ocurrió un error en la App, comunícate con el proveedor del software"
      );
    }
  };

  const handleEdit = (appointment: IAppointment) => {
    setCurrentAppointment(appointment);
    form.setFieldsValue({
      ...appointment,
      fecha_servicio: dayjs(appointment.fecha_servicio, "YYYY-MM-DD"),
      hora_servicio: dayjs(appointment.hora_servicio, "HH:mm"),
    });
    setIsAddingNew(false);
    setIsModalVisible(true);
  };

  const handleAddNew = () => {
    setCurrentAppointment(null);
    form.resetFields();
    setIsAddingNew(true);
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        fecha_servicio: values.fecha_servicio.format("YYYY-MM-DD"),
        hora_servicio: values.hora_servicio.format("HH:mm"),
      };

      let updatedFields: Partial<IAppointment> = {};

      if (currentAppointment) {
        if (
          currentAppointment.servicio_solicitado !==
          formattedValues.servicio_solicitado
        ) {
          updatedFields.servicio_solicitado =
            formattedValues.servicio_solicitado;
        }
        if (
          currentAppointment.fecha_servicio !== formattedValues.fecha_servicio
        ) {
          updatedFields.fecha_servicio = formattedValues.fecha_servicio;
        }
        if (
          currentAppointment.hora_servicio !== formattedValues.hora_servicio
        ) {
          updatedFields.hora_servicio = formattedValues.hora_servicio;
        }
        if (
          currentAppointment.nombre_cliente !== formattedValues.nombre_cliente
        ) {
          updatedFields.nombre_cliente = formattedValues.nombre_cliente;
        }
        if (
          currentAppointment.telefono_cliente !==
          formattedValues.telefono_cliente
        ) {
          updatedFields.telefono_cliente = formattedValues.telefono_cliente;
        }
        if (currentAppointment.comentarios !== formattedValues.comentarios) {
          updatedFields.comentarios = formattedValues.comentarios;
        }
      }

      if (isAddingNew) {
        // insert
        const response = await insertAppointment(formattedValues);
        if (response) showSuccess("Cita agregada exitosamente");
      } else {
        // update
        const response = await updateAppointment(
          updatedFields,
          currentAppointment?.id ?? ""
        );
        if (response) showSuccess("Cita actualizada exitosamente");
      }
      await getAllAppointments();

      setIsModalVisible(false);
      setCurrentAppointment(null);
    } catch (error) {
      showError(
        "Ocurrió un error en la App, comunícate con el proveedor del software"
      );
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentAppointment(null);
    setIsAddingNew(false);
  };

  const columns: TableColumnsType<IAppointment> = [
    {
      title: "Acciones",
      dataIndex: "operation",
      render: (_, record) =>
        allAppointments.length >= 1 ? (
          <div className='flex gap-x-3'>
            <Popconfirm
              title='¿Eliminar cita?'
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
      title: "Servicio solicitado",
      dataIndex: "servicio_solicitado",
    },
    {
      title: "Fecha del servicio",
      dataIndex: "fecha_servicio",
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "Hora del servicio",
      dataIndex: "hora_servicio",
      render: (text) => dayjs(text, "HH:mm").format("HH:mm"),
    },
    {
      title: "Nombre del cliente",
      dataIndex: "nombre_cliente",
    },
    {
      title: "Teléfono del cliente",
      dataIndex: "telefono_cliente",
    },
    {
      title: "Comentarios del cliente",
      dataIndex: "comentarios",
      width: 200,
      render: (text) => (
        <div style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
          {text}
        </div>
      ),
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
            type='primary'
            style={{ marginBottom: 16 }}
            onClick={handleAddNew}
          >
            Agregar cita
          </Button>
          <Table
            columns={columns}
            dataSource={allAppointments?.map((appointment: any) => ({
              ...appointment,
              key: appointment?.id,
            }))}
            size='small'
            pagination={{ pageSize: 10 }}
          />
          <Modal
            title={isAddingNew ? "Agregar Cita" : "Editar Cita"}
            open={isModalVisible}
            onOk={handleSave}
            onCancel={handleCancel}
          >
            <Form form={form} layout='vertical'>
              <Form.Item
                name='servicio_solicitado'
                label='Servicio solicitado'
                rules={[
                  {
                    required: true,
                    message: "Por favor seleccione el servicio solicitado",
                  },
                ]}
              >
                <Select>
                  {allServices.map((service: any) => (
                    <Select.Option key={service.id} value={service.id}>
                      {service.nombre_servicio}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name='fecha_servicio'
                label='Fecha del servicio'
                rules={[
                  {
                    required: true,
                    message: "Por favor seleccione la fecha del servicio",
                  },
                ]}
              >
                <DatePicker format='DD-MM-YYYY' />
              </Form.Item>
              <Form.Item
                name='hora_servicio'
                label='Hora del servicio'
                rules={[
                  {
                    required: true,
                    message: "Por favor seleccione la hora del servicio",
                  },
                ]}
              >
                <TimePicker format='HH:mm' />
              </Form.Item>
              <Form.Item
                name='nombre_cliente'
                label='Nombre del cliente'
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese el nombre del cliente",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name='telefono_cliente'
                label='Teléfono del cliente'
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese el teléfono del cliente",
                  },
                ]}
              >
                <Input type='number' step='any' />
              </Form.Item>
              <Form.Item name='comentarios' label='Comentarios del cliente'>
                <Input.TextArea />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default AppointmentsTable;
