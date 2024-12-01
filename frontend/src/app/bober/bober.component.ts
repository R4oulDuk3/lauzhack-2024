import {Component, OnInit} from '@angular/core';
import {BoberService} from "../../service/bober.service";

@Component({
  selector: 'app-bober',
  templateUrl: './bober.component.html',
  styleUrls: ['./bober.component.scss']
})
export class BoberComponent implements OnInit{
  error: string | null = null;


  selectedPage: string = 'control';
  currentAnimation: string = '';


  selectPage(page: string) {
    if (this.selectedPage !== page) {
      // Apply the "out" animation based on the chosen type
      this.currentAnimation = 'swipe-left-out';

      // Scroll to the top of the right panel when the page changes
      const rightPanel = document.getElementById('rightPanel');
      if (rightPanel) {
        rightPanel.scrollTop = 0;
      }

      setTimeout(() => {
        // Update the selected page and apply the corresponding "in" animation
        this.selectedPage = page;
        this.currentAnimation = 'swipe-left-in';
      }, 200); // Duration should match animation duration in CSS
    }
  }

  constructor(private boberService: BoberService) {}

  ngOnInit(): void {
  }

}
