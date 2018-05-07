sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/GroupHeaderListItem",
	"com/credit/limitcreditLimit/controller/Formatter"
], function(jQuery, Controller, JSONModel, GroupHeaderListItem, Formatter) {
	"use strict";
    
	return Controller.extend("com.credit.limitcreditLimit.controller.soList", {
        
        formatter : Formatter,
        
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.credit.limitcreditLimit.view.soList
		 */
		onInit: function() {
			this.soList = this.getView().byId("soList");
			this.modelSo = new sap.ui.model.json.JSONModel();
			this.shipToModel = new sap.ui.model.json.JSONModel();
			//this.modelSo.loadData("/sap/opu/odata/sap/ZSDGW_SO_LIST_SRV/ZSDC_SOListView?$filter=OverallSDProcessStatus eq 'C'");
			this.modelSo.loadData("/sap/opu/odata/sap/ZSDGW_SO_LIST_SRV/ZSDC_SOListView");
			var that = this;
			this.modelSo.attachRequestCompleted(function() {
				that.data = that.modelSo.getData();
				//that.createModelSo(that.data);
				that.assignModel(that.data);
				that.assignShipTo(that.data.d.results[0].SoldToParty,
								  that.data.d.results[0].ShipTo,
								  that.data.d.results[0].SalesOrganization,
								  that.data.d.results[0].DistributionChannel,
								  that.data.d.results[0].SoldToParty
				);
				//(SoldTo='10000146',ShipTo='50000021',SalesOrg='GN01',DistrChan='03',Plant='700')
				
			});
		},
		
		assignShipTo: function(SoldToParty){
			var sServiceUrl = "/sap/opu/odata/sap/ZSDGW_SO_CREATE_SRV_01/Bill_ToSet('" + SoldToParty + "')/SHIP_TOSet?$format=json";
				this.shipToModel.loadData(sServiceUrl);
				this.getView().setModel(this.shipToModel, "modelGasStation");
				
		},
		
		assignModel: function (data) {
				this.modelSo = new sap.ui.model.json.JSONModel(data);
				//this.soList.setModel(this.modelSo,"modelSo");
				//onsole.log(this.modelSo);
				this.getView().byId().setModel(this.modelSo);
				this.filters = [];
				this.filters.push( new sap.ui.model.Filter("OverallSDProcessStatus", sap.ui.model.FilterOperator.NE, "C"));
				this.getView().byId("soList").getBinding("items").filter(this.filters);
				this.getView().getModel().refresh(true);
				
		},
		
		onListItemPress: function (evt) {
			var so = evt.getSource().data("salesOrder");
			var customer =  evt.getSource().data("soldToParty");
			var hashUrl = "#SalesOrder-displayFactSheet?Customer=" + customer +"&SalesOrder=" + so ;
			sap.m.URLHelper.redirect(hashUrl, true);
			
		},
		
		onSearch : function (oEvt) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new sap.ui.model.Filter("SalesOrder", sap.ui.model.FilterOperator.Contains,sQuery);
				aFilters.push(filter);
			}

			// update list binding
			var list = this.getView().byId("soList");
			var binding = list.getBinding("items");
			binding.filter(aFilters);
		},
		
		getStatusTextSD: function(statusSD){
			console.log("esta entrando a getStatusTextSD:" + statusSD);
			this.model = new sap.ui.model.json.JSONModel();
			var sUrl = "/sap/opu/odata/sap/ZSDGW_SO_LIST_SRV/I_OverallSDProcessStatus('" + statusSD + "')";
			this.model.loadData(sUrl);
			var that = this;
			
			console.log("la liga"+ sUrl);
			this.model.attachRequestCompleted(function() {
			   console.log(that.model.getProperty("/d/results/OverallSDProcessStatus_Text"));
				return that.model.getProperty("/d/results/OverallSDProcessStatus_Text");
			});
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.credit.limitcreditLimit.view.soList
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.credit.limitcreditLimit.view.soList
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.credit.limitcreditLimit.view.soList
		 */
		//	onExit: function() {
		//
		//	}

	});

});