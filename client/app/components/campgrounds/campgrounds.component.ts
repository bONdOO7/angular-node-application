/**
 * Created by Laurence Ho on 07-02-2017.
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CampgroundService } from '../../services/campgounds.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'camps',
  templateUrl: './app/components/campgrounds/campgrounds.component.html',
  styleUrls: [ './app/components/campgrounds/campgrounds.component.css' ]
})

export class CampgroundsComponent implements OnInit {
  userdata: any;
  
  constructor(private router: Router, private campService: CampgroundService, private userService: UserService) {
  }
  
  ngOnInit() {
    this.userdata = this.userService.getUserData();
  }
}
