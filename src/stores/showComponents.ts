import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const showComponents = defineStore("showComponents", {
    state: () => ({
        filter: false,
        history: false,
        mapMarker: false
      }),
      actions: {
        showFilter(){
            this.history = false;
            this.mapMarker = false;
            setTimeout(()=>{
                this.filter = true;
            }, 400);
        },
        showMapMaker(){
            this.history = false;
            this.filter = false;
            setTimeout(() => {
                this.mapMarker = true;
            }, 400)
        },
        showHistory(){
            this.filter = false;
            this.mapMarker = false;
            setTimeout(()=>{
                this.history = true;
            }, 500)
        },
        esconderComponents(){
            this.filter = false;
            this.history = false;
            this.mapMarker = false;
        }
      }
});