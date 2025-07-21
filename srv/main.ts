import {service, Service} from '@sap/cds';
import {Customer, Customers} from '@models/sales';
import { getMaxListeners } from 'events';

export default (service :Service) => {
    service.after ('READ', 'Customers', (results: Customers) => {
        results.forEach(customer => {
            if (!customer.email?.includes('@')){
                customer.email = `${customer.email}@getMaxListeners@gmail.com`;
            }
        })
    })
}