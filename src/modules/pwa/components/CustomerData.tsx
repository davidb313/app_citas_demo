import { Input } from "antd";
import { UserOutlined, WhatsAppOutlined } from "@ant-design/icons";

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
      <Input
        value={customerComments}
        type='string'
        onChange={(e) => setCustomerComments(e.target.value)}
        size='large'
        placeholder='Algún comentario adicional?'
        prefix={<WhatsAppOutlined />}
      />
    </div>
  );
};
