import React, { useContext, useEffect, useRef, useState } from "react";
import type { GetRef, InputRef } from "antd";
import { Button, Form, Input, Popconfirm, Table, Switch } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
//import { useServices } from "../../../hooks/useServices";
import { client } from "../../../../supabase/client";
import { useMessages } from "../../../../hooks/useMessages";

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  id?: string;
  nombre_servicio: string;
  costo: string;
  estado: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className='editable-cell-value-wrap'
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  id?: string;
  nombre_servicio: string;
  costo: number;
  estado: boolean;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const ServicesScreen: React.FC = () => {
  const [allServices, setAllServices] = useState<any>([]);
  //const { allServices, setAllServices } = useServices();
  const { showSuccess, showError, showInfo, contextHolder } = useMessages();

  useEffect(() => {
    getAllServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllServices = async () => {
    try {
      const response = await client.from("servicios").select();
      if (response.status === 200 || response.status === 201) {
        setAllServices(response?.data);
      }
    } catch (err) {
      showError(
        "No se pudieron cargar los servicios, contacte al proveedor del software"
      );
    }
  };

  const handleAdd = async () => {
    const newData: Omit<DataType, "id"> = {
      nombre_servicio: `Servicio ${allServices.length + 1}`,
      costo: 20000,
      estado: true,
    };
    try {
      const response = await client.from("servicios").insert([newData]);
      if (response.status === 201 || response.status === 200) {
        setAllServices([...allServices, { ...newData }]);
        showSuccess("Servicio agregado exitosamente");
      } else {
        showError(
          "Error al agregar el servicio, comunícate con en el proveedor del software"
        );
      }
    } catch (error) {
      showError(
        "Ocurrió un error en la App, comunícate con en el proveedor del software"
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await getAllServices();
      if (allServices.length > 0) {
        const response = await client
          .from("servicios")
          .delete()
          .eq("id", id)
          .single();

        if (response.status === 200 || response.status === 204) {
          const newData = allServices.filter(
            (item: DataType) => item.id !== id
          );
          setAllServices(newData);
          showSuccess("Servicio eliminado exitosamente");
        } else {
          showInfo("Por favor intente eliminar este servicio en unos segundos");
        }
      } else {
        showInfo("No hay servicios disponibles para eliminar");
      }
    } catch (error) {
      showError(
        "Ocurrió un error en la App, comunícate con en el proveedor del software"
      );
    }
  };

  const handleSave = async (row: DataType) => {
    try {
      const newData = [...allServices];
      const index = newData.findIndex((item) => row.id === item.id);
      if (index > -1) {
        const item = newData[index];
        const updatedData = { ...item, ...row };
        const response = await client
          .from("servicios")
          .update(updatedData)
          .eq("id", row.id);
        if (response.status === 200 || response.status === 204) {
          newData.splice(index, 1, updatedData);
          setAllServices(newData);
          showSuccess("Servicio actualizado exitosamente");
        } else {
          showError("Error al actualizar el servicio");
        }
      }
    } catch (error) {
      showError(
        "Ocurrió un error en la App, comunícate con en el proveedor del software"
      );
    }
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "Nombre del servicio",
      dataIndex: "nombre_servicio",
      width: "30%",
      editable: true,
    },
    {
      title: "Valor",
      dataIndex: "costo",
      editable: true,
    },
    {
      title: "Activo",
      dataIndex: "estado",
      render: (_, record) => <Switch checked={record.estado} />,
    },
    {
      title: "Operación",
      dataIndex: "operation",
      render: (_, record) =>
        allServices.length >= 1 ? (
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
        ) : null,
    },
  ];

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      {contextHolder}
      <Button onClick={handleAdd} type='primary' style={{ marginBottom: 16 }}>
        Agregar servicio
      </Button>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={allServices.map((service: Item) => ({
          ...service,
          key: service.id,
        }))}
        columns={columns as ColumnTypes}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default ServicesScreen;
