sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"com/credit/limitcreditLimit/controller/Formatter"
], function(jQuery, Controller, JSONModel, Formatter) {
	"use strict";

	return Controller.extend("com.credit.limitcreditLimit.controller.main", {
		
		formatter : Formatter,
		
		onInit: function() {
			
			jQuery.sap.require("sap.ui.core.format.NumberFormat");
			this.control = false;
			this.numberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
				maxFractionDigits: 2,
				groupingEnabled: true,
				groupingSeparator: ",",
				decimalSeparator: "."
			});
			
			//Declare of Models
			this.oModelId = new sap.ui.model.json.JSONModel();
			this.oModelCreditLimit = new sap.ui.model.json.JSONModel();
			this.oModelCreditExposureList = new sap.ui.model.json.JSONModel();
			
			//Set Load
			this.oModelId.loadData("/sap/opu/odata/sap/ZSDGW_SO_CREATE_SRV_01/CustomerSet('')");
			
			var that = this;
			
			this.oModelId.attachRequestCompleted(function() {
			    that.BillTo = that.oModelId.getProperty("/d/BillTo");
				that.PartnerFunc = that.oModelId.getProperty("/d/PartnerFunc");
				that.oModelCreditLimit.loadData("/sap/opu/odata/sap/V_UKM_CREDIT_ACCOUNT_VIEW_CDS/v_ukm_credit_account_view(BusinessPartner='" + that.BillTo + "',CreditSegment='0000')");
				that.getView().setModel(that.oModelCreditLimit);
				that.oModelCreditExposureList.loadData("/sap/opu/odata/sap/FAR_CUSTOMER_LINE_ITEMS/Items?$filter=Customer eq '" + that.BillTo + "' and IsCleared eq '' and DueItemCategory ne 'M'" );
				var belowThat = that;
				that.oModelCreditExposureList.attachRequestCompleted(function() {
					var data = belowThat.oModelCreditExposureList.getData();
					var exposure = 0;
					var available = 0;
					for(var i=0; i<data.d.results.length; i++){
						exposure = exposure + +data.d.results[i].AmountInTransactionCurrency;                   
					}
					
					available = belowThat.getAvailable(exposure);
					
					exposure = belowThat.numberFormat.format(exposure) + " MXN"
					belowThat.getView().byId("commitment").setProperty("text",exposure);
					
					belowThat.totalFormatted = belowThat.numberFormat.format(available) + " MXN";
					console.log("restante:" + belowThat.totalFormatted);
					belowThat.getView().byId("available").setProperty("text",belowThat.totalFormatted);
				});
			});
			
		},
		
		getAvailable: function(exposure){
			
			console.log("commitment:" + exposure);
			var oModel = this.getView().getModel();
			var creditLimitAmount = oModel.getProperty("/d/CreditLimitAmount");
			var last = Number(creditLimitAmount) - Number(exposure);
			return last; 
		},
		
		getExposure: function () {
		  return this.totalFormatted;
		},
		
		
		onListItemPress: function(oEvent){
			
		}
		
	});
});