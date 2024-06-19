import { Input } from "antd";
import { UserOutlined, WhatsAppOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

interface CustomerDataProps {
  customerName: string;
  setCustomerName: (name: string) => void;
  customerNumber: string;
  setCustomerNumber: (number: string) => void;
  customerComments: string;
  setCustomerComments: (number: string) => void;
}

export const CustomerData: React.FC<CustomerDataProps> = ({
  customerName,
  setCustomerName,
  customerNumber,
  setCustomerNumber,
  customerComments,
  setCustomerComments,
}) => {
  const handleChange = (e: any) => {
    const { value } = e.target;
    if (value.length <= 50) {
      setCustomerComments(value);
    } else {
      setCustomerComments(value.slice(0, 50));
    }
  };

  return (
    <div className='mt-6 space-y-4'>
      <Input
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        size='large'
        placeholder='Tu nombre'
        prefix={<UserOutlined />}
      />
      <Input
        value={customerNumber}
        type='number'
        onChange={(e) => setCustomerNumber(e.target.value)}
        size='large'
        placeholder='Tu teléfono'
        prefix={<WhatsAppOutlined />}
      />
      <TextArea
        placeholder='Puedes añadir un comentario de máx. 50 caracteres, por ejemplo: Agendar con el Barbero Juan...'
        autoSize
        maxLength={50}
        onChange={handleChange}
        value={customerComments}
      />
    </div>
  );
};
