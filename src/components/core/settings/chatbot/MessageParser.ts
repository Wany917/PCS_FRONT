class MessageParser {
    constructor(actionProvider) {
      this.actionProvider = actionProvider;
    }
  
    parse(message) {
      const lowerCaseMessage = message.toLowerCase();
  
      if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('bonjour') || lowerCaseMessage.includes('salut')) {
        this.actionProvider.greet();
      } else if (lowerCaseMessage.includes('help') || lowerCaseMessage.includes('aide') || lowerCaseMessage.includes('support')) {
        this.actionProvider.handleHelp();
      } else if (lowerCaseMessage.includes('réserver') || lowerCaseMessage.includes('reservation') || lowerCaseMessage.includes('book')) {
        this.actionProvider.handleBooking();
      } else if (lowerCaseMessage.includes('annuler') || lowerCaseMessage.includes('annulation') || lowerCaseMessage.includes('cancel')) {
        this.actionProvider.handleCancellation();
      } else if (lowerCaseMessage.includes('paiement') || lowerCaseMessage.includes('payment') || lowerCaseMessage.includes('payer')) {
        this.actionProvider.handlePayment();
      } else if (lowerCaseMessage.includes('frais') || lowerCaseMessage.includes('tarif') || lowerCaseMessage.includes('prix') || lowerCaseMessage.includes('coût')) {
        this.actionProvider.handleFees();
      } else if (lowerCaseMessage.includes('hôte') || lowerCaseMessage.includes('host') || lowerCaseMessage.includes('propriétaire')) {
        this.actionProvider.handleContactHost();
      } else if (lowerCaseMessage.includes('prestation classique') || lowerCaseMessage.includes('services standard') || lowerCaseMessage.includes('offres standard')) {
        this.actionProvider.handleClassicServices();
      } else if (lowerCaseMessage.includes('prestation personnalisée') || lowerCaseMessage.includes('services personnalisés') || lowerCaseMessage.includes('offres personnalisées')) {
        this.actionProvider.handleCustomServices();
      } else {
        this.actionProvider.handleUnknown();
      }
    }
  }
  
  export default MessageParser;
  