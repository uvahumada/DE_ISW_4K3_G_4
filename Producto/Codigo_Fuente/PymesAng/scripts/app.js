// aqui va el codigo de nuestra aplicacion
myApp = angular.module('myApp', ['ui.bootstrap']);

myApp.service('myService', function ($timeout) {
    this.Alert = function (dialogText, dialogTitle) {
        var alertModal = $('<div id="myModal" class="modal fade" tabindex="-1" role="dialog"> <div class="modal-dialog"> <div class="modal-content" style="width: 80%;"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal">×</button> <h3>' + (dialogTitle || 'Atención!') + '</h3> </div> <div class="modal-body"><p>' + dialogText + '</p></div><div class="modal-footer"><button class="btn" data-dismiss="modal">Cerrar</button></div></div></div></div>');
        $timeout(function () { alertModal.modal(); });
    };

    this.Confirm = function (dialogText, okFunc, cancelFunc, dialogTitle, but1, but2) {
        var confirmModal = $('<div id="myModal" class="modal fade" tabindex="-1" role="dialog"> <div class="modal-dialog"> <div class="modal-content" style="width: 80%;"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal">×</button> <h3>' + dialogTitle + '</h3> </div> <div class="modal-body">' + dialogText + '</div><div class="modal-footer"><button ID="SiBtn" class="btn" data-dismiss="modal">' + (but1 == undefined ? 'Si' : but1) + '</button><button ID="NoBtn" class="btn" data-dismiss="modal">' + (but2 == undefined ? 'No' : but2) + '</button></div></div></div></div>');
        confirmModal.find('#SiBtn').click(function (event) {
            okFunc();
            confirmModal.modal('hide');
        });
        confirmModal.find('#NoBtn').click(function (event) {
            cancelFunc();
            confirmModal.modal('hide');
        });
        $timeout(function () { confirmModal.modal(); });
    };
});





myApp.controller('InicioCtrl', function ($scope) {
    $scope.Titulo = 'Ingenieria de Software';
    $scope.minDate = new Date();
});


myApp.controller('ArticulosCtrl',
    function ($scope, $http, myService) {
        $scope.Titulo = 'Pago y Recepcion de Pedido';  // inicia mostrando el Listado
        // articulo cargado inicialmente, como demo para probar la interface visual (luego comentar esta linea)
        $scope.Lista = [{
            IdArticulo: 1, Nombre: 'Empanadas Jamón y queso', Precio: 310, Stock: 12, FechaAlta: '2017-10-03T03:00:00', Activo: true, CodigoDeBarra: '1234567890123', IdArticuloFamilia: 1
}, { IdArticulo: 2, Nombre: 'Malbec Ruttini Reserva 2010', Precio: 6000, Stock: 4, FechaAlta: '17/01/2017', Activo: true, CodigoDeBarra: '1234567890123', IdArticuloFamilia: 1 }, {
            IdArticulo: 3
                , Nombre: ' Saint Honoré', Precio: 900, Stock: 2, FechaAlta: '17/01/2018', Activo: true, CodigoDeBarra: '1234567890123', IdArticuloFamilia: 1
            }];

       
        $scope.ElTotal='7210';
        $scope.TituloAccionABMC = { A: '(Agregar)', B: '(Eliminar)', M: '(Modificar)', C: '(Consultar)', L: null };
        $scope.AccionABMC = 'L';   // inicialmente inicia el el listado (buscar con parametros)
        $scope.Mensajes = { SD: ' No se encontraron registros...', RD: ' Revisar los datos ingresados...' };


        $scope.DtoFiltro = {};    // dto con las opciones para buscar en grilla
        $scope.DtoFiltro.Activo = null;
        $scope.PaginaActual = 1;  // inicia pagina 1

        // opciones del filtro activo
        $scope.OpcionesSiNo = [{ Id: null, Nombre: '' }, { Id: true, Nombre: 'Tarjeta' }, { Id: false, Nombre: 'Efectivo' }];

        
        ///**FUNCIONES**///
        $scope.Agregar = function () {
            $scope.AccionABMC = 'A';
            $scope.DtoSel = {};
            $scope.DtoSel.Activo = true;
            $scope.DtoSel.ChNow = false;
        };
       
//Buscar segun los filtros, establecidos en DtoFiltro
        $scope.Buscar = function () {
            alert('Buscando datos...');
        };


        $scope.Consultar = function (Dto) {
            $scope.BuscarPorId(Dto, 'C');
        };

        //comienza la modificacion, luego la confirma con el metodo Grabar
        $scope.Modificar = function (Dto) {
            if (!Dto.Activo) {
                myService.alert("No puede modificarse un registro Inactivo.");
                return;
            }
            $scope.BuscarPorId(Dto, 'M');
        };

        //Obtengo datos del servidor de un registros, metodo usado en el consultar y modificar
        //Obtengo un registro especifico según el Id
        $scope.BuscarPorId = function (Dto, AccionABMC) {
            $http.get('/api/Articulos/' + Dto.IdArticulo)
                .then(function (response) {
                    $scope.DtoSel = response.data;
                    //Si no usamos datepicker, formatear fecha de  ISO 8061 a string dd/MM/yyyy
                    //$scope.DtoSel.FechaAlta = $filter('date')($scope.DtoSel.FechaAlta, 'dd/MM/yyyy');
                    //Si usamos datepicker, convertir fecha de  ISO 8061 a fecha de javascript
                    $scope.DtoSel.FechaAlta = new Date($scope.DtoSel.FechaAlta);
                    $scope.AccionABMC = AccionABMC;
                });
        };


        //grabar tanto altas como modificaciones
        $scope.Grabar = function () {
            $scope.FormReg.$setUntouched();
            $scope.FormReg.$setPristine();  // restaura $submitted = false
            if ($scope.DtoSel.ChNow == true) {
                $scope.Volver();
                myService.Alert('Compra Realizada exitosamente, se enviará el producto a su domicilio Dentro de las proximas 24 hs!');
            }
            else {
                $scope.Volver();
                myService.Alert('Compra Realizada exitosamente, se enviará el producto a su domicilio a la fecha acordada!');
            }
         };

        $scope.ActivarDesactivar = function (Dto) {
            var resp = confirm("Esta seguro de " + (Dto.FormaPago ? "Tarjeta" : "Efectivo") + " ?");
            if (resp)
                alert('Articulo ' + (Dto.FormaPago ? "Tarjeta" : "Efectivo"));
        };

        // Volver Agregar/Modificar
        $scope.Volver = function () {
            $scope.DtoSel = null;
            $scope.AccionABMC = 'L';
           
        };
         //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //Formatea fecha Min Date hoy 
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        $scope.dt = new Date();
        $scope.minDate = new Date();
        $scope.format = "dd/MM/yyyy";
        $scope.altInputFormats = ['d!/M!/yyyy'];

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            minDate: new Date()
        }; 
        
        $scope.popup1 = {
            opened: false
        };

        $scope.changeHandler = function () {
            $scope.dateForm.dt.$setValidity('$valid', $scope.dt.getTime() >= $scope.minDate.getTime());
        };

        $scope.open1 = function () {
            $scope.popup1.opened = true;
        }; 


        $scope.ImprimirListado = function () {
            alert("Sin desarrollar...");
        };
            $scope.validarImporte = function ($scope) {
                var total = 7210 - parseInt($scope.DtoSel.SuPago);
                if (total >= 0) {
                    $scope.coincidencia = true;
                }
                else {
                    $scope.coincidencia = false;
                    $scope.ElPago = 'Ingrese Importe Mayor';
                }

            };





        });






