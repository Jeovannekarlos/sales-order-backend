import { CustomerServiceImpl } from "srv/services/Customer/implementation";
import { CustomerService } from "srv/services/Customer/protocols";

const makeCustomerService = (): CustomerService => {
    return new CustomerServiceImpl();
}

export const customerService = makeCustomerService();