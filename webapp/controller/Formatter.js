sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
	], function(jQuery, Controller, JSONModel) {

	"use strict";

	return {

			//BEGIN Set formatters
		formatStatus: function(state){
			if (state === "B"){
				return "Error";
			}
			if (state === "A"){
				return "Success";
			}
		},
		iconStatus: function(state){
			if (state === "B"){
				return "sap-icon://warning";
			}
			if (state === "A"){
				return "sap-icon://accept";
			}
		}
		//END Set Formaters

	};

});