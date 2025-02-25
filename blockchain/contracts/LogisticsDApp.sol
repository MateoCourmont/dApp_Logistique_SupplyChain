// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

struct Shipment {
    uint id; // ID unique de l'expedition
    address sender; // adresse Ethereum de l'expediteur
    address carrier; // adresse Ethereum du transporteur
    address receiver; // adresse Ethereum du destinataire
    string pickupLocation; // lieu de prise en charge
    string deliveryLocation; // lieu de livraison
    uint256 pickupTime; // heure de prise en charge
    uint256 deliveryTime; // heure de livraison
    uint price; // prix de l'expedition
    ShipmentStatus status; // statut de l'expedition
    bool paymentReleased; // indique si le paiement a été liberé
}

enum ShipmentStatus {
    Created,
    InTransit,
    Delivered,
    Completed,
    Canceled
}

/**
 * Contrôle des expeditons
 * Shipments control
 */
contract ShipmentControl {
    mapping(uint => Shipment) public shipments; // Stocke toutes les expéditions
    uint public shipmentCounter; // Compteur pour attribuer un ID unique à chaque expéditions

    /**
     * Créer une nouvelle expédition
     * Create a new shipment
     */
    function createShipment(
        address _carrier,
        address _receiver,
        string memory _pickupLocation,
        string memory _deliveryLocation,
        uint256 _price
    ) public {
        shipmentCounter++; // Incrémente l'ID pour créer un nouveau colis
        shipments[shipmentCounter] = Shipment(
            shipmentCounter,
            msg.sender, // L'expéditeur est celui qui appelle cette fonction
            _carrier,
            _receiver,
            _pickupLocation,
            _deliveryLocation,
            block.timestamp, // Enregistre la date de création
            0, // Date de livraison vide car le colis n'est pas encore arrivé
            _price,
            ShipmentStatus.Created, // Statut initial : "Created"
            false // Le paiement n'est pas encore libéré
        );
    }

    /**
     * Modifie le statut d'une expédition
     * Update the status of a shipment
     */
    function updateStatus(uint _id, ShipmentStatus _status) public {
        Shipment storage shipment = shipments[_id];
        require(
            msg.sender == shipment.carrier,
            "Carrier only can update the status."
        );
        shipment.status = _status;

        if (_status == ShipmentStatus.Delivered) {
            shipment.deliveryTime = block.timestamp;
        }
    }

    mapping(uint => uint) public escrowBalances;

    /**
     * Déposer le paiement de l'expédition
     * Deposit the payment for the shipment
     */
    function depositPayment(uint _id) public payable {
        Shipment storage shipment = shipments[_id];
        require(msg.sender == shipment.sender, "Sender only can pay.");
        require(msg.value == shipment.price, "Montant incorrect.");
        escrowBalances[_id] += msg.value;
    }

    /**
     * Libérer le paiement de l'expédition
     * Release the payment for the shipment
     */
    function releasePayment(uint _id) public {
        Shipment storage shipment = shipments[_id];
        require(
            msg.sender == shipment.receiver,
            "Receiver only can confirm the delivery."
        );
        require(
            shipment.status == ShipmentStatus.Delivered,
            "Delivery must be confirmed."
        );
        require(!shipment.paymentReleased, "Payment already released.");

        shipment.paymentReleased = true;
        payable(shipment.carrier).transfer(escrowBalances[_id]);
    }

    function cancelShipment(uint _id) public {
        Shipment storage shipment = shipments[_id];
        require(
            msg.sender == shipment.sender || msg.sender == shipment.carrier,
            "Sender or carrier only can cancel the shipment."
        );
        require(
            shipment.status == ShipmentStatus.Created,
            "Can only be canceled before delivery."
        );

        shipment.status = ShipmentStatus.Canceled;
        if (escrowBalances[_id] > 0) {
            payable(shipment.sender).transfer(escrowBalances[_id]); // Remboursement de l'expéditeur
        }
    }
}
