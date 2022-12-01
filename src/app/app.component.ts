import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";

enum CoffeeTypes {
    coffee,
    macchiato,
    withMilk,
    cappuccino
}

const CoffeePrices: Map<CoffeeTypes, number> = new Map([
    [CoffeeTypes.coffee, 0.4],
    [CoffeeTypes.macchiato, 0.5],
    [CoffeeTypes.withMilk, 0.6],
    [CoffeeTypes.cappuccino, 0.7],
]);

const CoffeeNames: Map<CoffeeTypes, string> = new Map([
    [CoffeeTypes.coffee, 'Sólo'],
    [CoffeeTypes.macchiato, 'Cortado'],
    [CoffeeTypes.withMilk, 'Con Leche'],
    [CoffeeTypes.cappuccino, 'Capuchino'],
]);

type MachineHistory = {
    coffeeType: CoffeeTypes;
    coffeeName: string;
    price: number;
    timestamp: number;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class AppComponent {
    readonly coffeeNames = CoffeeNames;
    readonly coffeeTypes = CoffeeTypes;
    readonly coffeePrices = CoffeePrices;
    readonly preparationTime = 3;
    readonly defaultMessage = 'Seleccione un café...'

    history: MachineHistory[] = [];
    balance: number = 0;
    isMakingCoffee: boolean = false;
    progress: number = 0;
    interval: number = 0;
    machineDisplayMessage: string = this.defaultMessage;
    displayChart: boolean = false;
    chartData = {
        labels: [this.coffeeNames.get(CoffeeTypes.coffee), this.coffeeNames.get(CoffeeTypes.macchiato), this.coffeeNames.get(CoffeeTypes.withMilk), this.coffeeNames.get(CoffeeTypes.cappuccino)],
        datasets: [
            {
                data: [0, 0, 0, 0],
                backgroundColor: [
                    "#42A5F5",
                    "#66BB6A",
                    "#FFA726"
                ],
                hoverBackgroundColor: [
                    "#64B5F6",
                    "#81C784",
                    "#FFB74D"
                ]
            }
        ]
    };
    revenueData: number[] = [];


    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}


    addBalance(value: number){
        this.balance = this.balance + value;
        this.messageService.add({
            severity: 'success',
            summary: 'Añadir Saldo',
            detail: `Se ha añadido ${value}€ de saldo`
        });
    }

    makeCoffee(coffeeType: CoffeeTypes){
        if(this.isMakingCoffee) return;

        const enoughBalance = this.balance && this.balance >= (this.coffeePrices.get(coffeeType) ?? 0)
        if(!enoughBalance){
            this.machineDisplayMessage = 'Saldo Insuficiente!';
            return;
        }
        const history = this.history;

        this.isMakingCoffee = true;
        this.balance = parseFloat((this.balance - (this.coffeePrices.get(coffeeType) ?? 0)).toFixed(2));
        history.push({
            coffeeType: coffeeType,
            coffeeName: this.coffeeNames.get(coffeeType) ?? '',
            price: this.coffeePrices.get(coffeeType) ?? 0,
            timestamp: Date.now()
        });
        this.history = [...history];

        this.machineDisplayMessage = `Preparando Café ${this.coffeeNames.get(coffeeType)}...`;
        let time = 0;
        this.interval = setInterval(() => {
            time = time +1;
            this.progress = Math.floor(time * 100 / this.preparationTime);
            if(this.progress === 100){
                this.clearInterval();
                this.machineDisplayMessage = 'Listo!';

                setTimeout(() => {
                    this.isMakingCoffee = false;
                    this.machineDisplayMessage = this.defaultMessage;
                }, 2000);
            }
        }, 1000);
    }

    showSellsDataModal(){
        this.calculateChartData();

        this.displayChart = true;
    }

    calculateChartData(){
        const coffeeSells = this.history.filter((coffee) => coffee.coffeeType === this.coffeeTypes.coffee).length;
        const macchiatoSells = this.history.filter((coffee) => coffee.coffeeType === this.coffeeTypes.macchiato).length;
        const withMilkSells = this.history.filter((coffee) => coffee.coffeeType === this.coffeeTypes.withMilk).length;
        const cappuccinoSells = this.history.filter((coffee) => coffee.coffeeType === this.coffeeTypes.cappuccino).length;

        this.chartData.datasets[0].data = [coffeeSells, macchiatoSells, withMilkSells, cappuccinoSells];

        this.revenueData = [
            coffeeSells * (this.coffeePrices.get(this.coffeeTypes.coffee) ?? 0),
            macchiatoSells * (this.coffeePrices.get(this.coffeeTypes.macchiato) ?? 0),
            withMilkSells * (this.coffeePrices.get(this.coffeeTypes.withMilk) ?? 0),
            cappuccinoSells * (this.coffeePrices.get(this.coffeeTypes.cappuccino) ?? 0),
        ];
    }

    resetBalance(){
        this.balance = 0;
        this.messageService.add({
            severity: 'info',
            summary: 'Restablecer Saldo',
            detail: 'Saldo Restablecido a 0€'
        });
    }

    confirm(event: Event) {
        this.confirmationService.confirm({
            //@ts-ignore
            target: event.target,
            message: 'Reiniciar el Saldo de la Coffee Machine?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Si',
            rejectLabel: 'No',
            accept: () => {
                this.resetBalance();
            },
            reject: () => {
                this.messageService.add({severity:'error', summary:'Cancelado', detail:'Ha cancelado el restableciomiento de saldo'});
            }
        });
    }

    private clearInterval(){
        clearInterval(this.interval);
    }
}
