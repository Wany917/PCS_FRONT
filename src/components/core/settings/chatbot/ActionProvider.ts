class ActionProvider {
    constructor(createChatBotMessage, setStateFunc) {
      this.createChatBotMessage = createChatBotMessage;
      this.setState = setStateFunc;
    }
  
    greet() {
      const greetingMessage = this.createChatBotMessage('Bonjour, comment puis-je vous aider ?');
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, greetingMessage],
      }));
    }
  
    handleHelp() {
      const helpMessage = this.createChatBotMessage('Bien sûr, je suis là pour vous aider. Que voulez-vous savoir ?');
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, helpMessage],
      }));
    }
  
    handleBooking() {
      const bookingMessage = this.createChatBotMessage('Pour réserver une location, recherchez un logement, sélectionnez les dates de votre séjour, puis cliquez sur le bouton "Réserver".');
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, bookingMessage],
      }));
    }
  
    handleCancellation() {
      const cancellationMessage = this.createChatBotMessage('Pour annuler une réservation, allez dans vos réservations, sélectionnez la réservation que vous souhaitez annuler et cliquez sur "Annuler".');
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, cancellationMessage],
      }));
    }
  
    handlePayment() {
      const paymentMessage = this.createChatBotMessage('Nous acceptons les cartes de crédit, PayPal, et d\'autres méthodes de paiement en ligne sécurisées.');
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, paymentMessage],
      }));
    }
  
    handleFees() {
      const feesMessage = this.createChatBotMessage('Les frais de service sont des frais supplémentaires pour couvrir les coûts de fonctionnement du site. Ils varient en fonction du montant de la réservation.');
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, feesMessage],
      }));
    }
  
    handleContactHost() {
      const contactHostMessage = this.createChatBotMessage('Vous pouvez contacter l\'hôte en cliquant sur le bouton "Contacter l\'hôte" sur la page de l\'annonce.');
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, contactHostMessage],
      }));
    }
  
    handleClassicServices() {
      const classicServicesMessage = this.createChatBotMessage('Nous offrons une gamme de prestations classiques, y compris le nettoyage de base, l\'accès Wi-Fi, et plus encore. Pour plus de détails, veuillez consulter notre section des prestations.');
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, classicServicesMessage],
      }));
    }
  
    handleCustomServices() {
      const customServicesMessage = this.createChatBotMessage('Vous pouvez personnaliser vos prestations selon vos besoins spécifiques, comme des services de ménage supplémentaires, des visites guidées, et plus encore. Pour plus de détails, veuillez consulter notre section des prestations personnalisées.');
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, customServicesMessage],
      }));
    }
  
    handleUnknown() {
      const unknownMessage = this.createChatBotMessage('Désolé, je n\'ai pas compris. Pouvez-vous reformuler votre question ?');
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, unknownMessage],
      }));
    }
  }
  
  export default ActionProvider;
  