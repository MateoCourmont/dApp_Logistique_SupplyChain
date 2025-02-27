/** Logique du contrat :
 * - L'expéditeur crée une expédition, en spécifiant le récepteur et le prix (status Created).
 *
 * - L'ID du transporteur, le lieu de prise en charge, le lieu de livraison,
 *  l'heure de prise en charge et l'heure de livraison sont
 *  vides pour être complétés par le transporteur au cours de la livraison.
 *
 * - Le transporteur peut accepter l'expédition. Une fois acceptée,
 *  l'expéditeur ne peut plus modifier et le transporteur devient responsable.
 *  Il complète alors les informations si dessus (status  "InTransit").
 *
 * - Lorsque l'expédition arrive à destination, le transporteur marque
 *  la livraison comme "Delivered" et le destinataire peut confirmer la livraison (status "Confirmed").
 *
 * - Une fois le status "Confirmed", l'expéditeur peut libérer le paiement (status "Completed").
 *
 * - L'expédition peut également être annulée par l'expéditeur (avant l'acceptation par le transporteur)
 *  ou par le destinataire (avant confiramtion de reception (colis endommagé...)), ou par le transporteur.
 */

// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "hardhat/console.sol";

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
    // Statut de l'expedition
    Created,
    Accepted,
    InTransit,
    Delivered,
    Confirmed,
    Completed,
    Canceled
}

contract LogisticsDApp {
    mapping(uint => Shipment) public shipments; // Stocke toutes les expéditions
    uint public shipmentCounter; // Compteur pour attribuer un ID unique à chaque expéditions

    /**
     * Fonction pour créer une expédition
     */
    function createShipment(address _receiver, uint _price) public {
        shipmentCounter++;
        shipments[shipmentCounter] = Shipment({
            id: shipmentCounter,
            sender: msg.sender,
            carrier: address(0), // Le transporteur est encore vide
            receiver: _receiver,
            pickupLocation: "",
            deliveryLocation: "",
            pickupTime: 0,
            deliveryTime: 0,
            price: _price,
            status: ShipmentStatus.Created,
            paymentReleased: false
        });
    }

    /**
     * Fonction d'acceptartion de l'expédition par le transporteur
     */
    function acceptShipment(uint256 _shipmentId) public {
        Shipment storage shipment = shipments[_shipmentId];

        // Vérifie que l'expédition est créee
        require(
            shipment.status == ShipmentStatus.Created,
            "Expedition already accepted or completed."
        );

        // Déclare l'expéditeur comme celui qui a accepté l'expédition
        shipment.carrier = msg.sender;
        shipment.status = ShipmentStatus.Accepted;
    }

    /**
     * Fonction de mise à jour des informations de l'expédition
     */
    function updateShipmentDetails(
        uint256 _shipmentId,
        string memory _pickupLocation,
        string memory _deliveryLocation,
        uint256 _pickupTime,
        uint256 _deliveryTime
    ) public {
        Shipment storage shipment = shipments[_shipmentId];

        // Vérifie que l'expédition est acceptée
        require(
            shipment.status == ShipmentStatus.Accepted,
            "Shipment not accepted yet."
        );

        // Vérifie que l'appelant est bien le transporteur
        require(
            shipment.carrier == msg.sender,
            "Only the assigned carrier can update this shipment."
        );

        // Mettre à jour les informations manquantes de l'expédition
        shipment.pickupLocation = _pickupLocation;
        shipment.deliveryLocation = _deliveryLocation;
        shipment.pickupTime = _pickupTime;
        shipment.deliveryTime = _deliveryTime;
        shipment.status = ShipmentStatus.InTransit; // Changer le statut une fois complété
    }

    /**
     * Fonction de marquage de livraison par le transporteur
     */
    function markAsDeliveredByCarrier(uint256 _shipmentId) public {
        Shipment storage shipment = shipments[_shipmentId];

        // Vérifie que l'expédition est en cours de livraison
        require(
            shipment.status == ShipmentStatus.InTransit,
            "Shipment not in progress."
        );

        // Vérifie que l'appelant est bien le transporteur
        require(
            shipment.carrier == msg.sender,
            "Only the assigned carrier can deliver the shipment."
        );

        // Marquer comme livré par le transporteur
        shipment.status = ShipmentStatus.Delivered;
        shipment.deliveryTime = block.timestamp; // Heure actuelle de livraison
    }

    /**
     * Fonction de confirmation de livraison par le destinataire
     */
    function confirmDelivery(uint256 _shipmentId) public {
        Shipment storage shipment = shipments[_shipmentId];

        // Vérifie que l'expédition est livrée
        require(
            shipment.status == ShipmentStatus.Delivered,
            "Shipment not delivered yet."
        );

        // Vérifie que l'appelant est bien le destinataire
        require(
            shipment.receiver == msg.sender,
            "Only the assigned receiver can confirm delivery."
        );

        // Le récepteur confirme la livraison
        shipment.status = ShipmentStatus.Confirmed;
        shipment.deliveryTime = block.timestamp; // Heure actuelle de livraison
    }

    /**
     * Fonction d'annulation d'expédition par l'expéditeur
     */
    function cancelShipmentBySender(uint256 _shipmentId) public {
        Shipment storage shipment = shipments[_shipmentId];

        // Vérifie que l'expédition est en cours de livraison
        require(
            shipment.status == ShipmentStatus.Created,
            "Shipment not created yet, or already completed."
        );

        // Vérifie que l'appelant est bien le destinataire
        require(
            shipment.sender == msg.sender,
            "Only the sender can cancel the shipment."
        );

        // Annuler l'expedition
        shipment.status = ShipmentStatus.Canceled;
    }

    /**
     * Fonction d'annulation d'expédition par le transporteur
     */
    function cancelShipmentByCarrier(uint256 _shipmentId) public {
        Shipment storage shipment = shipments[_shipmentId];

        // Vérifie que l'expédition est en cours de livraison
        require(
            shipment.status == ShipmentStatus.InTransit,
            "Shipment not accepted yet."
        );

        // Vérifie que l'appelant est bien le transporteur
        require(
            shipment.carrier == msg.sender,
            "Only the assigned carrier can cancel the shipment."
        );

        // Annuler l'expedition
        shipment.status = ShipmentStatus.Canceled;
    }

    /**
     * Fonction d'annulation d'expédition par le destinataire
     */
    function cancelShipmentByReceiver(uint256 _shipmentId) public {
        Shipment storage shipment = shipments[_shipmentId];

        // Vérifie que l'expédition est livrée
        require(
            shipment.status == ShipmentStatus.Delivered,
            "Shipment not delivered yet."
        );

        // Vérifie que l'appelant est bien le destinataire
        require(
            shipment.receiver == msg.sender,
            "Only the receiver can cancel the shipment."
        );

        // Annuler l'expedition
        shipment.status = ShipmentStatus.Canceled;
    }

    /**
     * Fonction de libération du paiement par l'expéditeur
     */
    function releasePayment(uint256 _shipmentId) public {
        Shipment storage shipment = shipments[_shipmentId];

        // Vérifie que l'expédition n'est pas déjà payée
        require(!shipment.paymentReleased, "Payment already released.");

        // Vérifie que l'expédition est confirmée
        require(
            shipment.status == ShipmentStatus.Confirmed,
            "Shipment not confirmed yet."
        );

        // Vérifie que l'appelant est bien l'expéditeur
        require(
            msg.sender == shipment.sender,
            "Only the sender can release the payment."
        );

        // Vérifie que le paiement n'a pas déjà été libéré
        require(!shipment.paymentReleased, "Payment already released.");

        // Libérer le paiement en faveur du transporteur
        shipment.paymentReleased = true;
        shipment.status = ShipmentStatus.Completed;

        // Transfert des fonds au transporteur
        payable(shipment.carrier).transfer(shipment.price);
    }

    /**
     * Fonction de recherche d'expéditions par ID
     */
    function getShipmentById(
        uint256 _shipmentId
    )
        public
        view
        returns (
            uint256 shipmentId,
            address sender,
            address carrier,
            address receiver,
            string memory pickupLocation,
            string memory deliveryLocation,
            uint256 pickupTime,
            uint256 deliveryTime,
            uint price,
            ShipmentStatus status,
            bool paymentReleased
        )
    {
        return getShipment(_shipmentId);
    }

    /**
     * Fonction de retour des informations de l'expédition
     */
    function getShipment(
        uint256 _shipmentId
    )
        public
        view
        returns (
            uint256 shipmentId,
            address sender,
            address carrier,
            address receiver,
            string memory pickupLocation,
            string memory deliveryLocation,
            uint256 pickupTime,
            uint256 deliveryTime,
            uint price,
            ShipmentStatus status,
            bool paymentReleased
        )
    {
        Shipment memory shipment = shipments[_shipmentId];

        return (
            _shipmentId,
            shipment.sender,
            shipment.carrier,
            shipment.receiver,
            shipment.pickupLocation,
            shipment.deliveryLocation,
            shipment.pickupTime,
            shipment.deliveryTime,
            shipment.price,
            shipment.status,
            shipment.paymentReleased
        );
    }

    // Permet au contrat de recevoir de l'ETH sans appeler de fonction spécifique
    receive() external payable {}

    // Permet au contrat de recevoir de l'ETH même si un mauvais selector est envoyé
    fallback() external payable {}
}
