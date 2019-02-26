import {Directive, ElementRef, HostListener, Input, NgModule, OnInit, Renderer2} from "@angular/core";

@Directive({
    selector: "[rInputMask]"
})
export class InputMaskDirective implements OnInit {

    constructor(private el: ElementRef) {
    }

    @Input("rInputMask")
    mask: string;

    public value: string;

    private static isNumeric(s: string) {
        if (s === " ") {
            return false;
        }
        return !isNaN(Number(s));
    }

    private static isAlpha(s: string) {
        return s.match(/^[a-z]+$/i) !== null;
    }

    @HostListener("input")
    onInput() {
        this.value = this.el.nativeElement.value;
        console.log(this.el.nativeElement);
        this.maskValue();
    }

    ngOnInit(): void {
    }

    public maskValue() {
        let maskedValue = "";
        let dif = 0;
        let caretDif = 0;

        for (let i = 0; i < this.mask.length; i++) {
            if (this.value.length === i) {
                break;
            }
            if (!InputMaskDirective.isAlpha(this.value.charAt(i))
                && !InputMaskDirective.isNumeric(this.value.charAt(i))
                && this.value.charAt(i) !== this.mask.charAt(i + dif)) {
                this.value = this.value.substring(0, i) + this.value.substring(i + 1);
                i--;
                caretDif++;
            } else if (this.mask.charAt(i + dif) === "9") {
                if (InputMaskDirective.isNumeric(this.value.charAt(i))) {
                    maskedValue += this.value.charAt(i);
                }
            } else if (this.mask.charAt(i + dif) === "A") {
                if (InputMaskDirective.isAlpha(this.value.charAt(i - dif))) {
                    maskedValue += this.value.charAt(i);
                }
            } else if (this.mask.charAt(i + dif) !== this.value.charAt(i) && maskedValue.charAt(i + dif) !== this.mask.charAt(i + dif)) {
                maskedValue += this.mask.charAt(i + dif);
                dif++;
                i--;
            } else {
                maskedValue += this.mask.charAt(i + dif);
            }
        }
        this.value = maskedValue;
        let caretPos = this.getCaretPos() + dif - caretDif;
        while (caretPos < this.value.length &&
        !InputMaskDirective.isNumeric(this.value.charAt(caretPos)) &&
        !InputMaskDirective.isAlpha(this.value.charAt(caretPos))) {
            caretPos++;
        }
        this.el.nativeElement.value = this.value;
        this.el.nativeElement.selectionStart = caretPos;
        this.el.nativeElement.selectionEnd = caretPos;
    }

    public getCaretPos() {
        return this.el.nativeElement.selectionStart;
    }
}

@NgModule({
    declarations: [
        InputMaskDirective
    ],
    exports: [
        InputMaskDirective
    ]

})
export class InputMaskModule {

}