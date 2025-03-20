import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {Subscription} from 'rxjs';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    NgClass
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  private breakpointObserver = inject(BreakpointObserver);
private subscriptions: Subscription = new Subscription();
isMobile: boolean = false;
  ngOnInit(): void {
   this.subscriptions.add(
     this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.Handset])
       .subscribe(breakpoint => {
         this.isMobile = breakpoint.matches;
       })
   )
  }

}
