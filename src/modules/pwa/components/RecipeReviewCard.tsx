import { Card, Typography } from "antd";

interface CardProps {
  id: string;
  name: string;
  selectedServiceId: string | null;
  costo: string | null;
  estado: boolean;
  setSelectedServiceId: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedServiceName: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedServiceCost: React.Dispatch<React.SetStateAction<string | null>>;
}

export const RecipeReviewCard: React.FC<CardProps> = ({
  id,
  name,
  selectedServiceId,
  setSelectedServiceId,
  estado,
  setSelectedServiceName,
  costo,
  setSelectedServiceCost,
}) => {
  const handleServiceClick = () => {
    if (selectedServiceId === id) {
      setSelectedServiceId(null);
      setSelectedServiceName(null);
      setSelectedServiceCost(null);
    } else {
      setSelectedServiceId(id);
      setSelectedServiceName(name);
      setSelectedServiceCost(costo);
    }
  };

  const formattedCosto =
    costo !== null
      ? new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
          maximumSignificantDigits: 3,
        }).format(Number(costo))
      : "N/A";

  return (
    <>
      {estado === true ? (
        <Card
          size='small'
          hoverable
          style={{
            marginTop: 16,
            border:
              selectedServiceId === id ? "2px solid blue" : "1px solid black",
            cursor: "pointer",
          }}
          onClick={handleServiceClick}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* <img
          alt='foto servicio'
          src={BARBERO}
          style={{
            height: "auto",
            width: 100,
            objectFit: "cover",
            marginRight: 16,
          }}
        /> */}
            <div>
              <Typography.Title level={5}>{name}</Typography.Title>
              <Typography.Text type='secondary'>
                Valor servicio: {formattedCosto}
              </Typography.Text>
            </div>
          </div>
        </Card>
      ) : null}
    </>
  );
};
