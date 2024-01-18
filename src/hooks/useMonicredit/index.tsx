import { useState, useEffect } from "react";

declare global {
  interface Window {
    PayDirect: any;
  }
}

interface IResponse {
  reference_code: string;
}

interface IUseMonicredit {
  mode: "demo" | "production";
  publicKey: string;
  email: string;
  amount: string;
  metadata: any;
  orderId: string;
  customer: ICustomer;
  feeBearer: string;
  revenueHeadCode: string;
  feePercentage: number;
  subAccountCode: string;
  feeFlat: number;
}

interface ICustomer {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface IItem {
  item: string;
  unit_cost: string;
  revenue_head_code: string;
}

const useMonicredit = ({
  mode,
  publicKey,
  orderId,
  customer,
  amount,
  revenueHeadCode,
  feePercentage,
  subAccountCode,
  feeFlat,
  feeBearer = "client",
}: IUseMonicredit): IResponse => {
  const [response, setResponse] = useState<IResponse>({
    reference_code: "",
  });

  useEffect(() => {
    const script = document.createElement("script");
    if (mode !== "production") {
      script.src = "https://demo.monicredit.com/js/demo.js";
    } else {
      script.src = "https://monicredit.com/js/demo.js";
    }
    script.async = true;
    document.body.appendChild(script);
    const PayDirect = window.PayDirect;
    var handler = PayDirect.invoice({
      public_key: publicKey,
      order_id: orderId,
      customer: customer,
      fee_bearer: feeBearer,
      items: [
        {
          item: orderId,
          unit_cost: amount,
          revenue_head_code: revenueHeadCode,
          split_details: [
            {
              sub_account_code: subAccountCode,
              fee_percentage: feePercentage,
              fee_flat: feeFlat,
            },
          ],
        },
      ],
      callback: function (response: IResponse) {
        setResponse(response);
        location.href = "/callback?reference=" + response.reference_code;
      },
      onClose: function () {
        location.href = "/";
      },
    });
    handler.openIframe();

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return response;
};

export default useMonicredit;
