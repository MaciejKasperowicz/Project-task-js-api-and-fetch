import './../css/client.css';
import ExcursionsAPI from './ExcursionsAPI';
import Client from './client';

document.addEventListener('DOMContentLoaded', init);

function init() {
    const excursionsAPI = new ExcursionsAPI("excursions");

    const client = new Client(excursionsAPI);
    client.loadExcursions();
    client.removePreviousOrders();
    client.addExcursionsToOrders();
    client.removeExcursionsFromOrders();
    client.confirmTheOrder();

}