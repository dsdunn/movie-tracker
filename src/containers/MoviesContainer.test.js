import React from 'react';
import { MoviesContainer, mapStateToProps, mapDispatchToProps } from './MoviesContainer.js';
import * as actions from '../actions';
import { shallow, mount } from 'enzyme';
import {deleteDatabaseFav, postFavorite} from '../api-calls';
jest.mock('../api-calls');

describe('MoviesContainer', () => {
  let wrapper, 
  mockDeleteLocalFav, 
  mockAddLocalFav, 
  mockMovies,
  mockShowAllMovies,
  mockHistory,
  mockUser;

  beforeEach(() => {
    mockDeleteLocalFav = jest.fn();
    mockAddLocalFav = jest.fn();
    mockUser = {name:'oscar', id: 4, favorites: [1, 4]};
    mockMovies = [{movie_id: 1}];
    mockShowAllMovies = true;
    mockHistory = [];

    wrapper = mount(<MoviesContainer 
      deleteLocalFav={mockDeleteLocalFav}
      addLocalFav={mockAddLocalFav}
      showAllMovies={mockShowAllMovies}
      user={mockUser}
      movies={mockMovies}
      history={mockHistory}
    />);
  });

  it('should match the snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('when toggleFav is called, if the movie id already exists in state, deleteLocalFav should be called', () => {
    wrapper.find('button').simulate('click');

    expect(mockDeleteLocalFav).toBeCalled();
  });

  it('when toggleFave is called it should call deleteDatabaseFav if movie_id already exists in state', async() => {
    await wrapper.find('button').simulate('click');

    expect(deleteDatabaseFav).toBeCalled();
  });

  it('should push login to history when there is no user logged in and toggleFav is called', () => {
    wrapper = mount(
      <MoviesContainer 
        deleteLocalFav={mockDeleteLocalFav}
        addLocalFav={mockAddLocalFav}
        showAllMovies={mockShowAllMovies}
        user={false}
        movies={mockMovies}
        history={mockHistory}
      />);
    wrapper.find('button').simulate('click');

    expect(mockHistory).toEqual(['/login']);
  });

  it('should add a new favorite to state if the movie_id doesnt already exist', () => {
    mockMovies = [{movie_id: 2}];
    wrapper = mount(<MoviesContainer 
      deleteLocalFav={mockDeleteLocalFav}
      addLocalFav={mockAddLocalFav}
      showAllMovies={mockShowAllMovies}
      user={mockUser}
      movies={mockMovies}
      history={[]}
    />);
    wrapper.find('button').simulate('click');

    expect(postFavorite).toBeCalled();
  });

  describe('mapStateToProps', () => {
    it('returns an object with the expected props', () => {
      const mockState= {
        movies: mockMovies,
        showAllMovies: mockShowAllMovies,
        user: mockUser,
        deleteLocalFav: mockDeleteLocalFav,
        addLocalFav: mockAddLocalFav,
        history: mockHistory
      };

      const expectedProps = {
        movies: mockMovies,
        showAllMovies: mockShowAllMovies,
        user: mockUser
      };
      const mappedProps = mapStateToProps(mockState);

      expect(mappedProps).toEqual(expectedProps);
    });
  });

  describe('mapDispatchToProps', () => {
    it('calls dipatch with addLocalFav', () => {
      const mockState= {
        movies: mockMovies,
        showAllMovies: mockShowAllMovies,
        user: mockUser,
        deleteLocalFav: mockDeleteLocalFav,
        addLocalFav: mockAddLocalFav,
        history: mockHistory
      }

      const mockDispatch = jest.fn();
      const mappedProps = mapDispatchToProps(mockDispatch);
      const actionToDispatch = actions.addLocalFav(mockMovies[0]);
      mappedProps.addLocalFav(mockMovies[0]);

      expect(mockDispatch).toBeCalledWith(actionToDispatch);
    });

    it('calls dipatch with deleteLocalFav', () => {
      const mockState= {
        movies: mockMovies,
        showAllMovies: mockShowAllMovies,
        user: mockUser,
        deleteLocalFav: mockDeleteLocalFav,
        addLocalFav: mockAddLocalFav,
        history: mockHistory
      };

      const mockDispatch = jest.fn();
      const mappedProps = mapDispatchToProps(mockDispatch);
      const actionToDispatch = actions.deleteLocalFav(mockMovies[0]);
      mappedProps.deleteLocalFav(mockMovies[0]);

      expect(mockDispatch).toBeCalledWith(actionToDispatch);
    });
  });
});
