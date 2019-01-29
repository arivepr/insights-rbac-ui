import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Route, Link } from 'react-router-dom';
import { Toolbar, ToolbarGroup, ToolbarItem, Title, Button } from '@patternfly/react-core';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import GroupCard from '../../PresentationalComponents/Group/PorfolioCard';
import GroupsFilterToolbar from '../../PresentationalComponents/Group/GroupsFilterToolbar';
import { fetchGroups } from '../../redux/Actions/GroupActions';
import { hideModal, showModal } from '../../redux/Actions/MainModalActions';
import AddGroup from './add-group-modal';
import RemoveGroup from './remove-group-modal';
import './group.scss';
import { scrollToTop } from '../../Helpers/Shared/helpers';

class Groups extends Component {
    state = {
      filteredItems: [],
      isOpen: false,
      filterValue: ''
    };

    fetchData = () => {
      this.props.fetchGroups();
    };

    componentDidMount() {
      this.fetchData();
      scrollToTop();
    }

    onFilterChange = filterValue => this.setState({ filterValue })

    renderToolbar() {
      return (
        <Toolbar className="toolbar-padding">
          <ToolbarGroup>
            <ToolbarItem>
              <Title size={ '2xl' }>All Groups</Title>
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup  className={ 'pf-u-ml-auto-on-xl' }>
            <ToolbarItem>
              <Link to="/groups/add-group">
                <Button
                  variant="primary"
                  aria-label="Create Group"
                >
                Create Group
                </Button>
              </Link>
            </ToolbarItem>
          </ToolbarGroup>
        </Toolbar>
      );
    }

    render() {
      let filteredItems = {
        items: this.props.groups
        .filter(({ name }) => name.toLowerCase().includes(this.state.filterValue.trim().toLowerCase()))
        .map(item => <GroupCard key={ item.id } { ...item } />),
        isLoading: this.props.isLoading && this.props.groups.length === 0
      };

      return (
        <Fragment>
          <GroupsFilterToolbar onFilterChange={ this.onFilterChange } filterValue={ this.state.filterValue }/>
          <Route exact path="/groups/add-group" component={ AddGroup } />
          <Route exact path="/groups/edit/:id" component={ AddGroup } />
          <Route exact path="/groups/remove/:id" component={ RemoveGroup } />
          { this.renderToolbar() }
          <ContentGallery { ...filteredItems } />
        </Fragment>
      );
    }
}

const mapStateToProps = ({ groupReducer: { groups, isLoading, filterValue }}) => ({
  groups,
  isLoading,
  searchFilter: filterValue
});

const mapDispatchToProps = dispatch => {
  return {
    fetchGroups: apiProps => dispatch(fetchGroups(apiProps)),
    hideModal: () => dispatch(hideModal()),
    showModal: (modalProps, modalType) => {
      dispatch(showModal({ modalProps, modalType }));
    }
  };
};

Groups.propTypes = {
  filteredItems: propTypes.array,
  groups: propTypes.array,
  platforms: propTypes.array,
  isLoading: propTypes.bool,
  searchFilter: propTypes.string,
  showModal: propTypes.func,
  hideModal: propTypes.func,
  fetchGroups: propTypes.func.isRequired
};

Groups.defaultProps = {
  groups: []
};

export default connect(mapStateToProps, mapDispatchToProps)(Groups);