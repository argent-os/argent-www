(function() {
  'use strict';

  angular.module('app.module.invoice', [])

  // The default logo for the invoice
  .constant('DEFAULT_LOGO', 'app/img/timekloudlogo-dark.png')

  // The invoice displayed when the user first uses the app
  .constant('DEFAULT_INVOICE', {
    tax: 6.00,
    invoice_number: 1,
    customer_info: {
      name: '',
      web_link: '',
      address1: '',
      address2: '',
      postal: ''
    },
    company_info: {
      name: '',
      web_link: '',
      address1: '',
      address2: '',
      postal: ''
    },
    items:[
      { qty: 1, description: '', cost: 9.99 }
    ]
  })

  // Service for accessing local storage
  .service('LocalStorage', [function() {

    var Service = {};

    // Returns true if there is a logo stored
    var hasLogo = function() {
      return !!localStorage['logo'];
    };

    // Returns a stored logo (false if none is stored)
    Service.getLogo = function() {
      if (hasLogo()) {
        return localStorage['logo'];
      } else {
        return false;
      }
    };

    Service.setLogo = function(logo) {
      localStorage['logo'] = logo;
    };

    // Checks to see if an invoice is stored
    var hasInvoice = function() {
      return !(localStorage['invoice'] == '' || localStorage['invoice'] == null);
    };

    // Returns a stored invoice (false if none is stored)
    Service.getInvoice = function() {
      if (hasInvoice()) {
        return JSON.parse(localStorage['invoice']);
      } else {
        return false;
      }
    };

    Service.setInvoice = function(invoice) {
      localStorage['invoice'] = JSON.stringify(invoice);
    };

    // Clears a stored logo
    Service.clearLogo = function() {
      localStorage['logo'] = '';
    };

    // Clears a stored invoice
    Service.clearinvoice = function() {
      localStorage['invoice'] = '';
    };

    // Clears all local storage
    Service.clear = function() {
      localStorage['invoice'] = '';
      Service.clearLogo();
    };

    return Service;

  }])

  .service('Currency', [function(){

    var service = {};

    service.all = function() {
      return [
        {
          name: 'Canadian Dollar ($)',
          symbol: 'CAD $ '
        },
        {
          name: 'Euro (€)',
          symbol: '€'
        },
        {
          name: 'Indian Rupee (₹)',
          symbol: '₹'
        },
        {
          name: 'Norwegian krone (kr)',
          symbol: 'kr '
        },
        {
          name: 'US Dollar ($)',
          symbol: '$'
        }
      ]
    }

    return service;
    
  }])

  // Main application controller
  .controller('InvoiceController', ['$scope', '$http', 'DEFAULT_INVOICE', 'DEFAULT_LOGO', 'LocalStorage', 'Currency',
    function($scope, $http, DEFAULT_INVOICE, DEFAULT_LOGO, LocalStorage, Currency) {

    // Set defaults
    $scope.currencySymbol = '$';
    $scope.logoRemoved = false;
    $scope.printMode   = false;

    (function init() {
      // Attempt to load invoice from local storage
      !function() {
        // var invoice = LocalStorage.getInvoice();
        // $scope.invoice = invoice ? invoice : DEFAULT_INVOICE;
      }();

      // Set logo to the one from local storage or use default
      !function() {
        var logo = LocalStorage.getLogo();
        $scope.logo = logo ? logo : DEFAULT_LOGO;
      }();

      $scope.availableCurrencies = Currency.all();
(function() {
  
  function scrollY() {
    return window.pageYOffset || docElem.scrollTop;
  }

  // from http://stackoverflow.com/a/11381730/989439
  function mobilecheck() {
    var check = false;
    (function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }

  var docElem = window.document.documentElement,
    // support transitions
    support = Modernizr.csstransitions,
    // transition end event name
    transEndEventNames = {
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'msTransition': 'MSTransitionEnd',
      'transition': 'transitionend'
    },
    transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
    docscroll = 0,
    // click event (if mobile use touchstart)
    clickevent = mobilecheck() ? 'touchstart' : 'click';

  function init() {
    var showMenu = document.getElementById( 'showMenu' ),
      perspectiveWrapper = document.getElementById( 'perspective' ),
      container = perspectiveWrapper.querySelector( '.container' ),
      contentWrapper = container.querySelector( '.wrapper' );

    showMenu.addEventListener( clickevent, function( ev ) {
      ev.stopPropagation();
      ev.preventDefault();
      docscroll = scrollY();
      // change top of contentWrapper
      contentWrapper.style.top = docscroll * -1 + 'px';
      // mac chrome issue:
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      // add modalview class
      classie.add( perspectiveWrapper, 'modalview' );
      // animate..
      setTimeout( function() { classie.add( perspectiveWrapper, 'animate' ); }, 25 );
    });

    container.addEventListener( clickevent, function( ev ) {
      if( classie.has( perspectiveWrapper, 'animate') ) {
        var onEndTransFn = function( ev ) {
          if( support && ( ev.target.className !== 'container' || ev.propertyName.indexOf( 'transform' ) == -1 ) ) return;
          this.removeEventListener( transEndEventName, onEndTransFn );
          classie.remove( perspectiveWrapper, 'modalview' );
          // mac chrome issue:
          document.body.scrollTop = document.documentElement.scrollTop = docscroll;
          // change top of contentWrapper
          contentWrapper.style.top = '0px';
        };
        if( support ) {
          perspectiveWrapper.addEventListener( transEndEventName, onEndTransFn );
        }
        else {
          onEndTransFn.call();
        }
        classie.remove( perspectiveWrapper, 'animate' );
      }
    });

    perspectiveWrapper.addEventListener( clickevent, function( ev ) { return false; } );
  }

  init();

})();
    })()
    // Adds an item to the invoice's items
    $scope.addItem = function() {
      // $scope.invoice.items.push({ qty:0, cost:0, description:"" });
    }

    // Toggle's the logo
    $scope.toggleLogo = function(element) {
      $scope.logoRemoved = !$scope.logoRemoved;
      LocalStorage.clearLogo();
    };

    // Triggers the logo chooser click event
    $scope.editLogo = function() {
      // angular.element('#imgInp').trigger('click');
      document.getElementById('imgInp').click();
    };

    // Remotes an item from the invoice
    $scope.removeItem = function(item) {
      // $scope.invoice.items.splice($scope.invoice.items.indexOf(item), 1);
    };

    // Calculates the sub total of the invoice
    $scope.invoiceSubTotal = function() {
      var total = 0.00;
      // angular.forEach($scope.invoice.items, function(item, key){
      //   total += (item.qty * item.cost);
      // });
      return total;
    };

    // Calculates the tax of the invoice
    $scope.calculateTax = function() {
      return (($scope.invoice.tax * $scope.invoiceSubTotal())/100);
    };

    // Calculates the grand total of the invoice
    $scope.calculateGrandTotal = function() {
      saveInvoice();
      return $scope.calculateTax() + $scope.invoiceSubTotal();
    };

    // Clears the local storage
    $scope.clearLocalStorage = function() {
      swal({   
        title: "Clear Invoice",   
        text: "Your invoice data will be cleared.",   
        type: "warning",   
        confirmButtonColor: "#F27474",           
        showCancelButton: true,   
        confirmButtonText: "Yes, clear invoice",   
        cancelButtonText: "No, cancel",   
        closeOnConfirm: true,   
        closeOnCancel: true,
        showLoaderOnConfirm: true        
      }, function(isConfirm) {
        if(isConfirm) {
          LocalStorage.clear();
          setInvoice(DEFAULT_INVOICE);
        }
      });     
    };

    // Sets the current invoice to the given one
    var setInvoice = function(invoice) {
      $scope.invoice = invoice;
      saveInvoice();
    };

    // Reads a url
    var readUrl = function(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
          document.getElementById('company_logo').setAttribute('src', e.target.result);
          LocalStorage.setLogo(e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
      }
    };

    // Saves the invoice in local storage
    var saveInvoice = function() {
      LocalStorage.setInvoice($scope.invoice);
    };

    // Runs on document.ready
    angular.element(document).ready(function () {
      // Set focus
      document.getElementById('invoice-number').focus();

      // Changes the logo whenever the input changes
      document.getElementById('imgInp').onchange = function() {
        readUrl(this);
      };
    });

  }])
})();
