const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LogisticsDApp", function () {
  let LogisticsDApp, logisticsDApp, owner, sender, carrier, receiver;

  // Avant chaque test, créer un contrat et un compte de test
  beforeEach(async function () {
    [owner, sender, carrier, receiver] = await ethers.getSigners();
    LogisticsDApp = await ethers.getContractFactory("LogisticsDApp");
    logisticsDApp = await LogisticsDApp.deploy();
    await logisticsDApp.waitForDeployment;
  });

  const shipmentStatusMap = [
    "Created",
    "Accepted",
    "In Transit",
    "Delivered",
    "Confirmed",
    "Completed",
    "Cancelled"
  ];

  it("should allow a sender to create a shipment", async function () {

    // Créer une expédition
    await logisticsDApp.connect(sender).createShipment(receiver.address, 100);

    // Vérifier le contenu de l'expédition
    const shipment = await logisticsDApp.getShipment(1);
    expect(shipment.sender).to.equal(sender.address);
    expect(shipment.receiver).to.equal(receiver.address);
    expect(shipment.price).to.equal(100);
  });

  it("should allow a carrier to accept a shipment", async function () {
    await logisticsDApp.connect(sender).createShipment(receiver.address, 100);

    // Acceptation de l'expédition par le transporteur
    await logisticsDApp.connect(carrier).acceptShipment(1);

    const shipment = await logisticsDApp.getShipment(1);
    expect(shipment.carrier).to.equal(carrier.address);
    expect(shipment.status).to.equal(1); // Accepted
  });

  it("should allow the carrier to update shipment details", async function () {
    await logisticsDApp.connect(sender).createShipment(receiver.address, 100);
    await logisticsDApp.connect(carrier).acceptShipment(1);

    // Mise à jour des informations de l'expédition
    await logisticsDApp
      .connect(carrier)
      .updateShipmentDetails(1, "Paris", "Nantes", 1625250000, 1625300000);

    const shipment = await logisticsDApp.getShipment(1);
    expect(shipment.pickupLocation).to.equal("Paris");
    expect(shipment.deliveryLocation).to.equal("Nantes");
    expect(shipment.status).to.equal(2); // InTransit
  });

  it("should allow the carrier to mark shipment as delivered", async function () {
    await logisticsDApp.connect(sender).createShipment(receiver.address, 100);
    await logisticsDApp.connect(carrier).acceptShipment(1);
    await logisticsDApp
      .connect(carrier)
      .updateShipmentDetails(1, "Paris", "Nantes", 1625250000, 1625300000);
    await logisticsDApp.connect(carrier).markAsDeliveredByCarrier(1);
    const shipment = await logisticsDApp.getShipment(1);
    expect(shipment.status).to.equal(3); // Delivered
  });

  it("should allow the receiver to confirm delivery", async function () {
    await logisticsDApp.connect(sender).createShipment(receiver.address, 100);
    await logisticsDApp.connect(carrier).acceptShipment(1);
    await logisticsDApp
      .connect(carrier)
      .updateShipmentDetails(1, "Paris", "Nantes", 1625250000, 1625300000);
    await logisticsDApp.connect(carrier).markAsDeliveredByCarrier(1);
    await logisticsDApp.connect(receiver).confirmDelivery(1);
    const shipment = await logisticsDApp.getShipment(1);
    expect(shipment.status).to.equal(4); // Confirmed
  });

  it("should allow the sender to release the payment", async function () {
    await logisticsDApp.connect(sender).createShipment(receiver.address, ethers.parseEther("1"));
    await logisticsDApp.connect(carrier).acceptShipment(1);
    await logisticsDApp
      .connect(carrier)
      .updateShipmentDetails(1, "Paris", "Nantes", 1625250000, 1625300000);
    await logisticsDApp.connect(carrier).markAsDeliveredByCarrier(1);
    await logisticsDApp.connect(receiver).confirmDelivery(1);
    let shipment = await logisticsDApp.getShipment(1);
    expect(shipment.status).to.equal(4); // Confirmed
    expect(shipment.paymentReleased).to.equal(false);

    // Envoyer des fonds au contrat
    await sender.sendTransaction({
      to: logisticsDApp.target,
      value: ethers.parseEther("1")
    });

    // Libérer le paiement
    await logisticsDApp.connect(sender).releasePayment(1);

    shipment = await logisticsDApp.getShipment(1);
    expect(shipment.paymentReleased).to.equal(true);
    expect(shipment.status).to.equal(5); // Completed

    // Vérifier que l'on ne peut plus libérer le paiement après
    await expect(
        logisticsDApp.connect(sender).releasePayment(1)
    ).to.be.revertedWith("Payment already released.");
  });

  it("should allow the sender to cancel the shipment", async function () {
    await logisticsDApp.connect(sender).createShipment(receiver.address, 100);
    await logisticsDApp.connect(sender).cancelShipmentBySender(1);
    const shipment = await logisticsDApp.getShipment(1);
    expect(shipment.status).to.equal(6); // Cancelled
  });

  it("should allow the carrier to cancel the shipment", async function () {
    await logisticsDApp.connect(sender).createShipment(receiver.address, 100);
    await logisticsDApp.connect(carrier).acceptShipment(1);
    await logisticsDApp
      .connect(carrier)
      .updateShipmentDetails(1, "Paris", "Nantes", 1625250000, 1625300000);
    await logisticsDApp.connect(carrier).cancelShipmentByCarrier(1);
      const shipment = await logisticsDApp.getShipment(1);
      expect(shipment.status).to.equal(6); // Cancelled
  });

  it("should allow the receiver to cancel the shipment", async function () {
    await logisticsDApp.connect(sender).createShipment(receiver.address, 100);
    await logisticsDApp.connect(carrier).acceptShipment(1);
    await logisticsDApp
      .connect(carrier)
      .updateShipmentDetails(1, "Paris", "Nantes", 1625250000, 1625300000);
    await logisticsDApp.connect(carrier).markAsDeliveredByCarrier(1);
    await logisticsDApp.connect(receiver).cancelShipmentByReceiver(1);
    const shipment = await logisticsDApp.getShipment(1);
    expect(shipment.status).to.equal(6); // Cancelled
  });

  it("should simulate a shipment and fetch its details", async function () {
    // Définition du prix
    const price = ethers.parseEther("0.3"); //

    // Création de l'expédition
    await logisticsDApp.connect(sender).createShipment(receiver.address, price);
    const shipmentId = 1; 

    // Acceptation de l'expédition par le transporteur
    await logisticsDApp.connect(carrier).acceptShipment(shipmentId);

    // Mise à jour des informations de l'expédition par le transporteur
    await logisticsDApp.connect(carrier).updateShipmentDetails(
      shipmentId,
      "Paris", // Pickup location
      "Nantes", // Delivery location
      1234567890,    // Pickup time (timestamp simulé)
      1234567895     // Delivery time (timestamp simulé)
    );

    // Vérifier que l'expédition a été mise à jour
    let shipment = await logisticsDApp.getShipment(shipmentId);
    expect(shipment.status).to.equal(2); // InTransit

    // Le transporteur marque l'expédition comme livrée
    await logisticsDApp.connect(carrier).markAsDeliveredByCarrier(shipmentId);

    // Vérifier que l'expédition a été marquée comme livrée
    shipment = await logisticsDApp.getShipment(shipmentId);
    expect(shipment.status).to.equal(3); // Delivered

    // Le destinataire confirme la livraison
    await logisticsDApp.connect(receiver).confirmDelivery(shipmentId);

    // Vérifier que l'expédition a été confirmée
    shipment = await logisticsDApp.getShipment(shipmentId);
    expect(shipment.status).to.equal(4); // Confirmed

    // Vérification du solde du transporteur avant paiement
    const initialBalance = await ethers.provider.getBalance(carrier.address);

    // L'expéditeur envoie les ETH au contrat pour payer le transporteur
    await sender.sendTransaction({
      to: logisticsDApp.target,
      value: price
    });

    // Libération du paiement
    await logisticsDApp.connect(sender).releasePayment(shipmentId);

    // Vérifier que le paiement a été libéré
    shipment = await logisticsDApp.getShipment(shipmentId);
    expect(shipment.status).to.equal(5); // Completed
    expect(shipment.paymentReleased).to.be.true;

    // Vérification du solde du transporteur après paiement
    const finalBalance = await ethers.provider.getBalance(carrier.address);
    expect(finalBalance).to.be.above(initialBalance); // Le transporteur a reçu les fonds

    // Afficher les informations de l'expédition dans la console après confirmation
    console.log("Shipment Information:");
    console.log("Shipment ID:", shipmentId);
    console.log("Sender Address:", shipment.sender);
    console.log("Receiver Address:", shipment.receiver);
    console.log("Carrier Address:", shipment.carrier);
    console.log("Pickup Location:", shipment.pickupLocation);
    console.log("Delivery Location:", shipment.deliveryLocation);
    console.log(`Price: ${ethers.formatEther(shipment.price)} ETH`);
    console.log(`Status: ${shipmentStatusMap[Number(shipment.status)]}`);
    console.log("Payed:", shipment.paymentReleased);
  });
});
